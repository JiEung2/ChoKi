/* eslint-disable @typescript-eslint/no-unused-vars */
import MissionItem from '@/components/Common/MissionItem';
import Image from 'next/image';
import notification_icon from '@/assets/icons/notification.svg';
import Link from 'next/link';
import child_profile from '@/assets/icons/child_profile.svg';
import level_icon from '@/assets/icons/level.svg';
import mission_plus from '@/assets/icons/mission_plus.svg';
import CommonModal from '@/components/Common/Modal';
import { useState, useEffect, useRef } from 'react';
import { searchItem } from '@/lib/api/searchItem';
import { getRouteList, getRouteDetails } from '@/lib/api/navigation';

export default function Index() {
	const missions: Mission[] = [
		{ type: 'SHOP', content: '동네 마트 장보기' },
		{ type: 'RECYCLE', content: '재활용 분리수거하기' },
		{ type: 'EXTRA_MISSION', content: '양치하기' },
	];

	const [currentStep, setCurrentStep] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedErrand, setSelectedErrand] = useState('');

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setCurrentStep(1);
		setSelectedErrand('');
	};

	const handleNext = () => setCurrentStep(prev => prev + 1);
	const handlePrev = () => setCurrentStep(prev => prev - 1);
	// 각 단계별 컴포넌트
	const StepOne = () => (
		<div className="flex flex-col h-full">
			<h2 className="text-xl font-bold mb-4">심부름 부여하기</h2>
			<div className="flex-1">
				<select
					className="w-full p-2 border rounded"
					onChange={e => setSelectedErrand(e.target.value)}
					value={selectedErrand}
				>
					<option value="">심부름 종류를 선택하세요</option>
					<option value="장보기">장보기</option>
					<option value="재활용">재활용</option>
					<option value="기타">기타</option>
				</select>
			</div>
			<div className="flex justify-between mt-auto">
				<button
					className="px-4 py-2 rounded bg-gray-100 text-gray-500"
					onClick={handleCloseModal}
				>
					이전
				</button>
				{selectedErrand && (
					<button
						className="px-4 py-2 rounded bg-orange_main text-white"
						onClick={handleNext}
					>
						다음
					</button>
				)}
			</div>
		</div>
	);

	const StepTwo = () => {
		const [selectedDestination, setSelectedDestination] = useState('');
		const [destinations, setDestinations] = useState<
			{ objectId: string; buildingName: string }[]
		>([]);
		const [routeDetails, setRouteDetails] = useState<any>(null);
		const mapRef = useRef<any>(null);
		const polylineRef = useRef<any>(null);
		const markersRef = useRef<any[]>([]);

		useEffect(() => {
			// 목적지 목록 가져오기
			const fetchDestinations = async () => {
				try {
					const routeList = await getRouteList();
					// 형식 변경
					const formattedDestinations = routeList.map((route: any) => ({
						objectId: route.objectId,
						buildingName: route.destination.buildingName,
					}));
					setDestinations(formattedDestinations);
				} catch (error) {
					console.error('목적지 정보 가져오기 실패핑:', error);
				}
			};

			fetchDestinations();
		}, []);

		useEffect(() => {
			// 카카오맵 화면 띄우기
			const kakao = (window as any).kakao;
			const initializeMap = (latitude: number, longitude: number) => {
				if (kakao && kakao.maps) {
					kakao.maps.load(() => {
						const mapContainer = document.getElementById('map');
						const mapOptions = {
							center: new kakao.maps.LatLng(latitude, longitude),
							level: 4,
						};
						const mapInstance = new kakao.maps.Map(mapContainer, mapOptions);
						mapRef.current = mapInstance;

						const markerPosition = new kakao.maps.LatLng(latitude, longitude);
						const marker = new kakao.maps.Marker({
							position: markerPosition,
						});
						marker.setMap(mapInstance);
					});
				}
			};

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						initializeMap(latitude, longitude);
					},
					error => {
						console.error('현재 위치 가져오기 실패핑:', error);
						initializeMap(37.5665, 126.978);
					},
					{ enableHighAccuracy: true },
				);
			} else {
				// 현재 위치 못가져오면 중심 서울로
				initializeMap(37.5665, 126.978);
			}
		}, []);

		// 목적지 선택 함수
		const handleDestinationChange = async (
			e: React.ChangeEvent<HTMLSelectElement>,
		) => {
			const destinationId = e.target.value;
			setSelectedDestination(destinationId);

			try {
				const details = await getRouteDetails(destinationId);
				setRouteDetails(details);
				if ((window as any).kakao && (window as any).kakao.maps) {
					drawRoute(details);
				}
			} catch (error) {
				console.error('경로 상세정보 가져오기 실패핑:', error);
			}
		};

		// 경로 그리는 함수
		const drawRoute = (details: any) => {
			const kakao = (window as any).kakao;

			if (!kakao || !kakao.maps || !mapRef.current) {
				console.error('Kakao Maps SDK is not loaded or map is not initialized');
				return;
			}

			if (polylineRef.current) {
				polylineRef.current.setMap(null);
			}
			markersRef.current.forEach(marker => marker.setMap(null));
			markersRef.current = [];

			const { startPoint, destination, routes } = details;

			const routePoints = [
				new kakao.maps.LatLng(startPoint.latitude, startPoint.longitude),
				...routes.map(
					(route: any) =>
						new kakao.maps.LatLng(route.latitude, route.longitude),
				),
				new kakao.maps.LatLng(destination.latitude, destination.longitude),
			];

			const startMarkerImage = new kakao.maps.MarkerImage(
				'/icons/start_icon.svg',
				new kakao.maps.Size(40, 40),
				{ offset: new kakao.maps.Point(20, 40) },
			);
			const endMarkerImage = new kakao.maps.MarkerImage(
				'/icons/destination_icon.svg',
				new kakao.maps.Size(40, 40),
				{ offset: new kakao.maps.Point(20, 40) },
			);

			const startMarker = new kakao.maps.Marker({
				position: routePoints[0],
				image: startMarkerImage,
			});
			startMarker.setMap(mapRef.current);
			markersRef.current.push(startMarker);

			const endMarker = new kakao.maps.Marker({
				position: routePoints[routePoints.length - 1],
				image: endMarkerImage,
			});
			endMarker.setMap(mapRef.current);
			markersRef.current.push(endMarker);

			const polyline = new kakao.maps.Polyline({
				map: mapRef.current,
				path: routePoints,
				strokeWeight: 5,
				strokeColor: '#FF0000',
				strokeOpacity: 0.7,
				strokeStyle: 'solid',
			});
			polylineRef.current = polyline;

			// 지도 축척
			const bounds = new kakao.maps.LatLngBounds();
			routePoints.forEach(point => bounds.extend(point));
			mapRef.current.setBounds(bounds);
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold mb-4">경로 설정</h2>
				<div className="flex-1">
					<select
						className="w-full p-2 border rounded"
						onChange={handleDestinationChange}
						value={selectedDestination}
					>
						<option value="">목적지를 선택하세요</option>
						{destinations.map(destination => (
							<option key={destination.objectId} value={destination.objectId}>
								{destination.buildingName}
							</option>
						))}
					</select>
				</div>

				<div
					id="map"
					className="mt-4"
					style={{ width: '100%', height: '400px' }}
					ref={mapRef}
				></div>
				<div className="flex justify-between mt-auto">
					<button
						className="px-4 py-2 rounded bg-gray-100 text-gray-500"
						onClick={handlePrev}
					>
						이전
					</button>
					<button
						className="px-4 py-2 rounded bg-orange-400 text-white"
						onClick={handleNext}
						disabled={!selectedDestination}
					>
						다음
					</button>
				</div>
			</div>
		);
	};

	const SearchContent = ({
		onClose,
		onItemSelect,
	}: {
		onClose: () => void;
		onItemSelect: (item: any) => void;
	}) => {
		const [itemName, setItemName] = useState('');
		const [searchResults, setSearchResults] = useState<
			ItemSearchResponse[] | []
		>([]);
		const PAGE_SIZE = 5;

		const handleSearch = async () => {
			try {
				const result = await searchItem(itemName, 0, PAGE_SIZE);
				setSearchResults(result);
				console.log(result);
			} catch (error) {
				console.error('검색 중 오류 발생:', error);
				setSearchResults([]);
			}
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold text-center m-4">검색 결과</h2>
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full p-2 border rounded"
						placeholder="물품을 검색해보세요"
						value={itemName}
						onChange={e => setItemName(e.target.value)}
						onKeyPress={e => e.key === 'Enter' && handleSearch()}
					/>
					<button
						onClick={handleSearch}
						className="absolute right-3 top-1/2 transform -translate-y-1/2"
					>
						🔍
					</button>
				</div>

				<div className="text-sm text-gray-500 mb-2">
					찾고 있는 물건이 없나요? +
				</div>

				<div className="flex-1 overflow-y-auto space-y-2">
					{searchResults.map((item: any, index: number) => (
						<div
							key={index}
							className="flex items-center space-x-3 p-2 border rounded-lg"
						>
							<div className="w-16 h-16 rounded-lg overflow-hidden">
								<Image
									src={item.image}
									alt={item.productName || '상품 이미지'}
									width={64}
									height={64}
									className="object-cover"
								/>
							</div>
							<div className="flex-1">
								<div className="font-medium">{item.productName}</div>
							</div>
							<button
								onClick={() => {
									onItemSelect(item);
									onClose();
								}}
								className="px-4 py-2 bg-orange-100 text-orange_main rounded-lg text-sm"
							>
								담기
							</button>
						</div>
					))}
				</div>
			</div>
		);
	};

	interface CartItem extends ItemSearchResponse {
		quantity: number;
	}

	const StepThree = () => {
		const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
		const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

		const handleItemSelect = (item: ItemSearchResponse) => {
			setSelectedItems(prev => {
				const existingItem = prev.find(i => i.barcode === item.barcode);
				if (existingItem) {
					return prev.map(i =>
						i.barcode === item.barcode ? { ...i, quantity: i.quantity + 1 } : i,
					);
				}
				return [...prev, { ...item, quantity: 1 }];
			});
		};

		const handleQuantityChange = (barcode: string, delta: number) => {
			setSelectedItems(prev =>
				prev
					.map(item => {
						if (item.barcode === barcode) {
							const newQuantity = Math.max(0, item.quantity + delta);
							return { ...item, quantity: newQuantity };
						}
						return item;
					})
					.filter(item => item.quantity > 0),
			);
		};

		const handleDelete = (barcode: string) => {
			setSelectedItems(prev => prev.filter(item => item.barcode !== barcode));
		};

		// API 요청 보낼 데이터로 형식 변경 (shoppingList)
		const getShoppingList = () => {
			return selectedItems.map(item => ({
				barcode: item.barcode,
				quantity: item.quantity,
			}));
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold text-center m-4">장바구니 설정</h2>
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full p-2 border rounded"
						placeholder="물품을 검색해보세요"
						onClick={() => setIsSearchModalOpen(true)}
						readOnly
					/>
					<button
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
						onClick={() => setIsSearchModalOpen(true)}
					>
						🔍
					</button>
				</div>

				<div className="ml-2 mb-2">장바구니 목록</div>
				<div className="flex-1 overflow-y-auto">
					{selectedItems.map(item => (
						<div
							key={item.barcode}
							className="flex items-center space-x-3 p-2 border rounded-lg mb-2"
						>
							<div className="flex aligh-center w-16 h-16">
								<Image
									src={item.image}
									alt={item.productName}
									width={64}
									height={64}
									className="object-cover"
								/>
							</div>
							<div className="flex max-w-[90px]">
								<div className="text-sm">{item.productName}</div>
							</div>
							<div className="flex items-center w-[100px]">
								<button
									onClick={() => handleQuantityChange(item.barcode, -1)}
									className="w-4 h-4 rounded-full bg-light_yellow_dark flex items-center justify-center"
								>
									-
								</button>
								<span className="w-8 text-center text-sm">{item.quantity}</span>
								<button
									onClick={() => handleQuantityChange(item.barcode, 1)}
									className="w-4 h-4 rounded-full bg-light_yellow_dark flex items-center justify-center"
								>
									+
								</button>
								<button
									onClick={() => handleDelete(item.barcode)}
									className="ml-2 w-12 h-6 bg-orange-100 text-orange_main rounded-lg text-sm"
								>
									삭제
								</button>
							</div>
						</div>
					))}
				</div>

				<CommonModal
					isOpen={isSearchModalOpen}
					onClose={() => setIsSearchModalOpen(false)}
					size="large"
				>
					<SearchContent
						onClose={() => setIsSearchModalOpen(false)}
						onItemSelect={handleItemSelect}
					/>
				</CommonModal>

				<div className="flex justify-between mt-4">
					<button
						className="px-4 py-2 rounded bg-gray-100 text-gray-500"
						onClick={handlePrev}
					>
						이전
					</button>
					<button
						className="px-4 py-2 rounded bg-orange_main text-white"
						onClick={handleNext}
					>
						다음
					</button>
				</div>
			</div>
		);
	};
	const ShoppingConfirmation = () => {
		return <div className="flex flex-col h-full"></div>;
	};

	// 각 단계별 모달 사이즈 정의
	const getModalSize = (step: number) => {
		switch (step) {
			case 1:
				return 'small';
			case 2:
				return 'medium';
			case 3:
				return 'large';
			default:
				return 'medium';
		}
	};

	const ErrandConfirmation = () => (
		<div className="flex flex-col h-full">
			<h2 className="text-xl font-bold mb-4">
				김애기에게 다음의
				<br />
				심부름을 부여하시겠어요?
			</h2>
			<div className="flex-1">
				<input
					type="text"
					className="w-full p-2 border rounded"
					value={selectedErrand}
					readOnly
				/>
			</div>
			<div className="flex justify-between mt-auto gap-2">
				<button
					className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-500"
					onClick={handlePrev}
				>
					이전
				</button>
				<button
					className="flex-1 px-4 py-2 rounded bg-orange_main text-white"
					onClick={handleCloseModal}
				>
					완료
				</button>
			</div>
		</div>
	);

	// 현재 단계와 선택된 심부름에 따른 컨텐츠 렌더링
	const renderContent = () => {
		if (currentStep === 1) {
			return <StepOne />;
		}

		if (selectedErrand === '장보기') {
			switch (currentStep) {
				case 2:
					return <StepTwo />;
				case 3:
					return <StepThree />;
				case 4:
					return <ShoppingConfirmation />;
				default:
					return null;
			}
		} else {
			return <ErrandConfirmation />;
		}
	};

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow background min-h-screen">
				{/* 알림 아이콘 */}
				<div className="flex justify-end m-4">
					<Link href="/parents/1/notification">
						<div className="bg-white rounded-xl shadow-sm flex items-center justify-center">
							<Image
								src={notification_icon}
								alt="notification"
								width={50}
								height={50}
							/>
						</div>
					</Link>
				</div>
				{/* 안내문구 */}
				<div className="text-xl font-medium mb-6 ml-10">
					<span className="font-bold">김애기</span>의 성장을 위해,
					<br />
					오늘은 어떤 심부름을 시켜볼까요?
				</div>
				{/* 아이정보 */}
				<div className="flex justify-center items-center">
					<div className="w-[330px] bg-light_yellow_dark rounded-2xl p-6 mb-8">
						<h2 className="text-lg font-bold mb-4">아이 정보</h2>
						<div className="flex justify-center items-center gap-4">
							<div className="flex flex-col">
								<Image
									src={child_profile}
									alt="child profile"
									width={80}
									height={80}
									className="rounded-full mb-4"
								/>
								<div className="flex w-[70px] bg-white rounded-lg justify-center items-center gap-1">
									<Image src={level_icon} alt="level" width={20} height={20} />
									<span className="text-sm font-bold">Lv.10</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="text-gray-600">이름:</span>
									<span className="font-medium">김애기</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">닉네임:</span>
									<span>일 잘하는 애기</span>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-gray-600 min-w-10">주소:</span>
									<span className="max-w-30 break-words">
										서울특별시 강남구 테헤란로 426
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">연락처:</span>
									<span>010-1234-5678</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 심부름 목록 */}
				<div>
					<div className="flex ml-8 mb-4 gap-2">
						<h2 className="text-lg font-bold">심부름 목록</h2>
						<button className="w-6 h-6 rounded-lg shadow-sm flex items-center justify-center">
							<Image
								src={mission_plus}
								alt="mission_plus"
								onClick={handleOpenModal}
							/>
						</button>
					</div>
					<div className="flex flex-col justify-center items-center">
						{missions.map((mission, index) => (
							<MissionItem
								key={index}
								type={mission.type}
								content={mission.content}
								onClick={() =>
									console.log(`Clicked mission: ${mission.content}`)
								}
							/>
						))}
					</div>
				</div>
				<CommonModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					size={getModalSize(currentStep)}
				>
					{renderContent()}
				</CommonModal>
			</div>
		</>
	);
}

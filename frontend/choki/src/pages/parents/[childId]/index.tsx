import MissionItem from '@/components/Common/MissionItem';
import Image from 'next/image';
import notification_icon from '@/assets/icons/notification.svg';
import Link from 'next/link';
import child_profile from '@/assets/icons/child_profile.svg';
import level_icon from '@/assets/icons/level.svg';
import mission_plus from '@/assets/icons/mission_plus.svg';
import CommonModal from '@/components/Common/Modal';
import { useState } from 'react';
import { searchItem } from '@/lib/api/searchItem';

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
						className="px-4 py-2 rounded bg-orange-400 text-white"
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

		// 예시 장소 리스트
		const destinations = [
			{ id: 1, buildingName: '승필 백화점' },
			{ id: 2, buildingName: '호현 카페' },
			{ id: 3, buildingName: '민주 구멍가게' },
		];

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold mb-4">경로 설정</h2>
				<div className="flex-1">
					<select
						className="w-full p-2 border rounded"
						onChange={e => setSelectedDestination(e.target.value)}
						value={selectedDestination}
					>
						<option value="">목적지를 선택하세요</option>
						{destinations.map(destination => (
							<option key={destination.id} value={destination.buildingName}>
								{destination.buildingName}
							</option>
						))}
					</select>
				</div>
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

	const StepThree = () => {
		const [searchTerm, setSearchTerm] = useState('');

		// 검색 처리 함수
		const handleSearch = async () => {
			try {
				const result = await searchItem(searchTerm);
				console.log('검색 결과:', result);
				// 여기서 검색 결과를 활용하여 UI를 업데이트할 수 있습니다
			} catch (error) {
				console.error('검색 중 오류 발생:', error);
				// 에러 처리
			}
		};

		// 입력 변경 핸들러
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		};

		// 검색어 입력 후 엔터 키 처리
		const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				handleSearch();
			}
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold text-center">장바구니 설정</h2>
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full p-2 border rounded"
						placeholder="물건을 검색하세요"
						value={searchTerm}
						onChange={handleInputChange}
						onKeyPress={handleKeyPress}
					/>
					<button
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
						onClick={handleSearch}
					>
						🔍
					</button>
				</div>
				<div className="text-sm mb-4">찾고 있는 물건이 없나요? ➕</div>

				<div className="flex justify-between mt-4">
					<button
						className="px-4 py-2 rounded bg-gray-100 text-gray-500"
						onClick={handlePrev}
					>
						이전
					</button>
					<button
						className="px-4 py-2 rounded bg-orange-400 text-white"
						onClick={handleNext}
					>
						완료
					</button>
				</div>
			</div>
		);
	};

	// 각 단계별 모달 사이즈 정의
	const getModalSize = (step: number) => {
		switch (step) {
			case 1:
				return 'small';
			case 2:
			case 3:
				return 'medium';
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
					className="flex-1 px-4 py-2 rounded bg-orange-400 text-white"
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

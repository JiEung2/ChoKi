import axiosInstance from '@/lib/api/axiosInstance';
const baseURL = process.env.NEXT_PUBLIC_API_URL;
// const baseURL = 'https://choki.co.kr';

// 상품 검색 API
export const searchItem = async (
	itemName: string,
	page: number,
	size: number,
): Promise<ItemSearchResponse[]> => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/api/shopping/item/search`,
			{
				itemName,
				page,
				size,
			},
		);
		return response.data;
	} catch (error) {
		console.error('Error in searchItem:', error);
		throw error;
	}
};

// 장보기 최종 부여 모달
export const createShopping = async (
	requestBody: ShoppingRequest,
): Promise<any> => {
	try {
		const response = await axiosInstance.post(
			`/api/shopping/create`,
			requestBody,
		);
		return response.data;
	} catch (error) {
		console.error('장보기 미션 생성 실패:', error);
		throw error;
	}
};
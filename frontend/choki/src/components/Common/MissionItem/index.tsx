// components/Common/MissionItem/index.tsx
import Image from 'next/image';
import shopIcon from '@/assets/icons/basket_icon.svg';
import recycleIcon from '@/assets/icons/recycling_icon.svg';
import extraMissionIcon from '@/assets/icons/other_icon.svg';

interface MissionItemProps {
	type: MissionType;
	content: string;
	onClick?: () => void;
}

const MISSION_IMAGES: Record<MissionType, string> = {
	SHOP: shopIcon,
	RECYCLE: recycleIcon,
	EXTRA_MISSION: extraMissionIcon,
};

export default function MissionItem({
	type,
	content,
	onClick,
}: MissionItemProps) {
	const image = MISSION_IMAGES[type];
	return (
		<button
			onClick={onClick}
			className="w-[330px] p-2 bg-white rounded-2xl shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-colors  mb-3"
		>
			<div className="flex items-center justify-center ml-4">
				<Image
					src={image}
					alt={content}
					width={60}
					height={60}
					className="object-contain"
				/>
			</div>
			<span className="text-lg font-semibold ml-6">{content}</span>
		</button>
	);
}
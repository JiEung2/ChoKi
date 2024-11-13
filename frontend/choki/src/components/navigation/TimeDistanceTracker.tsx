import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type RoutePoint = {
	latitude: number;
	longitude: number;
};

type TimeDistanceTrackerProps = {
	route: RoutePoint[];
	userLocation: [number, number] | null;
};

const AVERAGE_WALKING_SPEED = 1.0;
const AVERAGE_STEP_LENGTH = 0.5;
const OFF_ROUTE_THRESHOLD = 20;

const TimeDistanceTracker: React.FC<TimeDistanceTrackerProps> = ({ route }) => {
	const [userLocation, setUserLocation] = useState<[number, number] | null>(
		null,
	);
	const [remainingTime, setRemainingTime] = useState(0);
	const [remainingSteps, setRemainingSteps] = useState(0);
	const [isOffRoute, setIsOffRoute] = useState(false);

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number => {
		const R = 6371000;
		const phi1 = (lat1 * Math.PI) / 180;
		const phi2 = (lat2 * Math.PI) / 180;
		const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
		const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
			Math.cos(phi1) *
				Math.cos(phi2) *
				Math.sin(deltaLambda / 2) *
				Math.sin(deltaLambda / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	};

	useEffect(() => {
		// Fetch initial position with getCurrentPosition
		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setUserLocation([longitude, latitude]);
			},
			error => console.error('Error getting initial location:', error),
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);

		// Set up continuous location tracking with watchPosition
		const watchId = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setUserLocation([longitude, latitude]);
			},
			error => console.error('Error watching location:', error),
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);

		// Clear watch on component unmount
		return () => navigator.geolocation.clearWatch(watchId);
	}, []);

	useEffect(() => {
		if (!userLocation || route.length === 0) {
			return;
		}

		// Define destination as the last point in the route
		const destination = route[route.length - 1];

		// Calculate the direct distance from the current location to the destination
		const remainingDistance = calculateDistance(
			userLocation[1],
			userLocation[0],
			destination.latitude,
			destination.longitude,
		);

		// Check if user is off-route based on a threshold
		setIsOffRoute(remainingDistance > OFF_ROUTE_THRESHOLD);

		// Estimate time and steps
		const timeInSeconds = remainingDistance / AVERAGE_WALKING_SPEED;
		const steps = remainingDistance / AVERAGE_STEP_LENGTH;

		// Update remaining time and steps
		setRemainingTime(Math.ceil(timeInSeconds / 60)); // Convert to minutes
		setRemainingSteps(Math.ceil(steps));
	}, [route, userLocation]);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '0',
				width: '100%',
				backgroundColor: isOffRoute ? '#FF6347' : '#ADD8E6',
				borderTopLeftRadius: '20px',
				borderTopRightRadius: '20px',
				padding: '20px',
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
				boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
			}}
		>
			<div style={{ textAlign: 'center' }}>
				<Image
					src="/icons/clock_icon.png"
					alt="Time Icon"
					width={30}
					height={30}
					style={{ marginBottom: '5px', marginLeft: '10px' }}
				/>
				<div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
					{remainingTime}분
				</div>
				<div style={{ fontSize: '14px', color: 'white' }}>남은 시간</div>
			</div>

			<div style={{ textAlign: 'center' }}>
				<Image
					src="/icons/step_icon.png"
					alt="Steps Icon"
					width={30}
					height={30}
					style={{ marginBottom: '5px', marginLeft: '15px' }}
				/>
				<div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
					{remainingSteps}보
				</div>
				<div style={{ fontSize: '14px', color: 'white' }}>남은 걸음 수</div>
			</div>
		</div>
	);
};

export default TimeDistanceTracker;

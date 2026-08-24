import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

function MapScreenshot({ onReady }) {
	const map = useMap();

	useEffect(() => {
		const screenshotter = new SimpleMapScreenshoter({
			hidden: true,
			mimeType: 'image/png',
			screenName: 'map',
			hideElementsWithSelectors: ['.leaflet-control-container'],
		});

		const takeScreenshot = async () => {
			try {
				console.log('Taking screenshot...');

				const blob = await screenshotter.takeScreen('blob');

				console.log('Screenshot created:', blob);

				const url = URL.createObjectURL(blob);

				const link = document.createElement('a');
				link.href = url;
				link.download = 'map.png';

				document.body.appendChild(link);
				link.click();
				link.remove();

				URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Failed to create map screenshot', error);
			}
		};

		onReady?.(takeScreenshot);

		return () => {
			map.removeControl(screenshotter);
			onReady(null);
		};
	}, [map, onReady]);

	return null;
}

export default MapScreenshot;

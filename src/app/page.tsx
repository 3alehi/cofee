import { themeController } from 'xtreme-ui';

import { DashboardProvider } from '#components/context';

import PageContainer from './_homepage/PageContainer';
import { DEFAULT_THEME_COLOR } from '#utils/constants/common';

export default async function Homepage () {
	const color =  DEFAULT_THEME_COLOR;
	return (
		<>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController({ color }) }} suppressHydrationWarning />
			</head>
			<body dir='rtl'>
				<DashboardProvider>
					<PageContainer />
				</DashboardProvider>
			</body>
		</>
	);
}

/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController, TThemeColor } from 'xtreme-ui';


export default async function RootLayout ({ children, params }: IRootProps) {
	const themeColor = 'red' as unknown as TThemeColor;

	return (
		<>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController({color: themeColor}) }} suppressHydrationWarning />
			</head>
			<body suppressHydrationWarning>
				{ children }
			</body>
		</>
	);
}

interface IRootProps {
	children?: ReactNode;
	params: {
		restaurant: string;
	};
}

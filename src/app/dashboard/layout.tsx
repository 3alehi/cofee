/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController, TThemeColor } from 'xtreme-ui';


export const metadata = {
	title: 'OrderWorder ⌘ Admin',
};
export default async function RootLayout ({ children }: IRootProps) {
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
}

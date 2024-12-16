import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full min-h-full flex items-center justify-center pt-20 text-2xl">
			{children}
		</div>
	);
};

export default layout;

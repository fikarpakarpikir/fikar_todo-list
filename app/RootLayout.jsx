"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Provider } from "react-redux";
import store from "@/utils/redux/store";

export default function ClientRootLayout({ children }) {
	const [isLoaded, setIsLoaded] = useState(false);
	// const [isLoaded, setIsLoaded] = useState(true);

	useEffect(() => {
		setIsLoaded(true);
	}, []);
	return (
		<div role='main'>
			{!isLoaded ? (
				<div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-50'>
					<div className='text-center text-primary'>
						Sebentar ya...
						<motion.div
							className='m-auto'
							animate={{
								rotate: [0, 180],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}>
							{/* <Image
								src='/logo/png/tertiary_1.png'
								alt='loader'
								width={150}
								height={150}
							/> */}
						</motion.div>
					</div>
				</div>
			) : (
				// <SessionProvider>
				<Provider store={store}>{children}</Provider>
				// </SessionProvider>
			)}
		</div>
	);
}

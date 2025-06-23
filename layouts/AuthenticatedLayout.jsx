import AuthGuard from "@/middleware/AuthGuard";
import {
	processMessageFailedReducer,
	toastStateReducer,
} from "@/utils/redux/slice/processStateSlice";
import {
	faAnglesLeft,
	faAnglesRight,
	faBars,
	faBriefcase,
	faCalendar,
	faChevronDown,
	faCircleQuestion,
	faCircleUser,
	faClipboardList,
	faClipboardUser,
	faFileContract,
	faFileLines,
	faFilePen,
	faFileSignature,
	faGear,
	faHome,
	faPowerOff,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Drawer,
	Dropdown,
	DropdownDivider,
	DropdownItem,
	Tooltip,
} from "flowbite-react";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AuthenticatedLayout({ header, auth, flash, children }) {
	const dispatch = useDispatch();

	useEffect(() => {
		if (flash?.error) {
			dispatch(toastStateReducer("failed"));
			dispatch(processMessageFailedReducer(flash?.error));
		}
	}, [flash]);

	// console.log(auth.user?.org?.dokumen?.foto);
	const { processState, processMessageFailed } = useSelector(
		(state) => state.process.default
	);

	const [showNav, setShowNav] = useState(screen > 450 ? true : false);
	const [showNavDropdown, setShowNavDropdown] = useState(false);
	const [showNavDrawer, setShowNavDrawer] = useState(false);
	const [showExpand, setShowExpand] = useState(screen > 1028 || screen <= 640);

	const navigateToTab = (index) => {
		nonActiveButtonNav(setButtonNavActive, index);
		activeButtonNav(setButtonNavActive, index);
		setShowNav(false);
	};
	const activeButtonNav = useCallback((setButton, navIndex) => {
		setButton((prevVisibility) => ({
			...prevVisibility,
			[navIndex]: true,
		}));
	}, []);

	const nonActiveButtonNav = useCallback((setButton, navIndex) => {
		// setButton((prevVisibility) => ({
		//     ...prevVisibility,
		//     [navIndex]: false,
		// }));

		setButton(
			listNav.forEach((item, i) => {
				i != navIndex ? true : false;
			})
		);
	}, []);

	const ButtonNavIcon = ({ i, icon, text, active = null, handleClick }) => {
		return (
			<button
				className={`btn ${
					active ? "border-bottom border-warning text-white" : ""
				} text-center text-capitalize mx-1 px-2 pb-2 mb-0`}
				onClick={handleClick}>
				<span className={`text-md ${active && "text-warning"}`}>
					<FontAwesomeIcon icon={icon} />
				</span>
				{/* <br /> */}
				<span className='text-xs font-audiowide'>{text}</span>
			</button>
		);
	};

	return (
		<AuthGuard>
			<div className='min-h-screen bg-neutral-100'>
				<nav className='fixed top-0 md:left-10 z-50 md:w-[95%] w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-b-lg shadow'>
					<div className='px-3 py-1 lg:px-5 lg:pl-3'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center justify-start rtl:justify-end'>
								<a href={"/"} className='flex ms-2 md:me-24'>
									<span className='self-center font-semibold sm:text-lg whitespace-nowrap dark:text-white'>
										To Do List
									</span>
								</a>
							</div>
							<div className='flex items-center'>
								<div className='flex items-center ms-3'>
									<Dropdown
										label=''
										dismissOnClick={false}
										renderTrigger={() => (
											<div className='flex cursor-pointer'>
												<FontAwesomeIcon
													icon={faCircleUser}
													className='cursor-pointer text-white fs-4'
												/>

												<FontAwesomeIcon
													icon={faChevronDown}
													className={`p-2 pe-0`}
												/>
											</div>
										)}>
										<DropdownItem as='a' href={"/"}>
											<div className='w-5 h-5 text-center'>
												<FontAwesomeIcon icon={faHome} />
											</div>
											<span className='ms-3'>Dashboard</span>
										</DropdownItem>
										<DropdownDivider />
										<DropdownItem onClick={() => handleLogout()}>
											<div className='w-5 h-5 text-center'>
												<FontAwesomeIcon
													icon={faPowerOff}
													className='text-danger'
												/>
											</div>
											<span className='ms-3'>Log Out</span>
										</DropdownItem>
									</Dropdown>
								</div>
							</div>
						</div>
					</div>
				</nav>

				<div
					className={`px-3 py-2 transition-all duration-300 ease-in-out sm:ml-12 ${
						showExpand ? "lg:ml-64" : "lg:ml-16"
					}`}>
					<div className='p-1 md:p-4 mt-10'>{children}</div>
				</div>
			</div>
		</AuthGuard>
	);
}

"use client";
import Input from "@/components/Forn/Input";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { fetchChecklist } from "@/utils/redux/slice/checklistSlice";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import {
	faCheckCircle,
	faCheckToSlot,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "flowbite-react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { useDispatch, useSelector } from "react-redux";

export default function Checklist() {
	const dispatch = useDispatch();
	const { checklists, loadingChecklist } = useSelector(
		(state) => state.checklist
	);
	// const [checklists, setChecklists] = useState([]);
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		// api.get("/checklist").then((res) => setChecklists(res.data.data));

		dispatch(fetchChecklist());
	}, [dispatch]);

	// const handleDelete = async (id) => {
	// 	await api.delete(`/checklists/${id}`);
	// 	setChecklists(checklists.filter((c) => c.id !== id));
	// };

	const breakpointColumnsObj = {
		default: 4,
		1100: 2,
		700: 1,
	};
	return (
		<AuthenticatedLayout>
			<div className='bg-white rounded-lg p-4'>
				<div className='flex justify-center items-center my-2'>
					<Formik>
						{({ handleSumbit, handleChange, handleBlur, values, errors }) => (
							<Form className='min-w-[400px] flex justify-between items-center border border-gray-200 shadow-lg rounded-lg px-2'>
								<Input
									borderless
									className='border-0 min-w-[350px]'
									placeholder='Apa yang harus saya lakukan...'
								/>
								<FontAwesomeIcon icon={faPlus} className='text-gray-400' />
							</Form>
						)}
					</Formik>
				</div>
				{loadingChecklist ? (
					<Spinner />
				) : (
					<Masonry
						breakpointCols={breakpointColumnsObj}
						className='my-masonry-grid mt-3'
						columnClassName='my-masonry-grid_column'>
						{checklists?.map((item, index) => (
							<div
								key={index}
								className='bg-white rounded-lg border border-gray-200 shadow-md p-3'>
								<div className='flex justify-between items-center mb-2'>
									<span className='font-bold border-primary border-b-2 rounded-l-md ps-2'>
										{item.name}
									</span>
									<button className='btn text-primary' onClick={() => {}}>
										<FontAwesomeIcon
											icon={
												item.checklistCompletionStatus
													? faSquare
													: faCheckCircle
											}
										/>
									</button>
								</div>
								<fieldset>
									<legend className='sr-only'>Checkbox variants</legend>

									{item.items?.map((td, j) => (
										<div className='flex items-center mb-3' key={j}>
											<input
												checked={td.itemCompletionStatus}
												id='checkbox-1'
												type='checkbox'
												value={td.id}
												className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
											/>
											<label
												htmlFor='checkbox-1'
												className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
												{td.name}
											</label>
										</div>
									))}
								</fieldset>
							</div>
						))}
					</Masonry>
				)}
			</div>
		</AuthenticatedLayout>
	);
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Checklist = () => {
	const [checklists, setChecklists] = useState([]);

	// useEffect(() => {
	// 	api.get("/checklists").then((res) => setChecklists(res.data));
	// }, []);

	const handleDelete = async (id) => {
		await api.delete(`/checklists/${id}`);
		setChecklists(checklists.filter((c) => c.id !== id));
	};

	return (
		<div className='p-4'>
			<h1 className='text-xl font-bold mb-4'>Checklist</h1>
			<Link href='/checklist/new' className='btn'>
				+ Checklist Baru
			</Link>
			<div className='grid grid-cols-2 gap-4 mt-4'>
				{checklists.map((cl) => (
					<div
						key={cl.id}
						className='p-4 rounded shadow'
						style={{ backgroundColor: cl.color }}>
						<h2>{cl.title}</h2>
						<Link href={`/checklist/${cl.id}`}>Detail</Link>
						<button onClick={() => handleDelete(cl.id)}>Hapus</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Checklist;

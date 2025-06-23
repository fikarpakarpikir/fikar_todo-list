"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewChecklistPage() {
	const [title, setTitle] = useState("");
	const [color, setColor] = useState("#ffffff");
	const router = useRouter();

	const handleCreate = async () => {
		await api.post("/checklists", { title, color });
		router.push("/checklist");
	};

	return (
		<div className='p-4 max-w-md mx-auto'>
			<h1 className='text-xl font-bold mb-4'>Checklist Baru</h1>
			<input
				className='input'
				placeholder='Judul'
				onChange={(e) => setTitle(e.target.value)}
			/>
			<input
				className='input'
				type='color'
				value={color}
				onChange={(e) => setColor(e.target.value)}
			/>
			<button className='btn' onClick={handleCreate}>
				Simpan
			</button>
		</div>
	);
}

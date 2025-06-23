export default function ChecklistCard({ checklist }) {
	return (
		<div
			className='p-4 rounded-lg shadow'
			style={{ backgroundColor: checklist.color }}>
			<h2 className='font-bold'>{checklist.title}</h2>
			<Link href={`/checklist/${checklist.id}`}>Lihat</Link>
			<button onClick={() => handleDelete(checklist.id)}>Hapus</button>
		</div>
	);
}

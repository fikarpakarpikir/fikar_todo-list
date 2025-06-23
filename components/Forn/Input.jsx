import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

const Input = (
	{
		className = "",
		label,
		id,
		type = "text",
		name,
		error = null,
		touched = null,
		handleChange = null,
		handleBlur = null,
		values = null,
		placeholder = "",
		readonly = false,
		isFocused = false,
		accept = null,
		icon = null,
		borderless = false,
	},
	ref
) => {
	const localRef = useRef(null);

	useImperativeHandle(ref, () => ({
		focus: () => localRef.current?.focus(),
	}));

	useEffect(() => {
		if (isFocused) {
			localRef.current?.focus();
		}
	}, [isFocused]);
	return (
		<div className={className}>
			<InputLabel
				htmlFor={id}
				value={label}
				className='font-bold text-sm md:text-lg'>
				{label}
			</InputLabel>
			<div className='relative'>
				<input
					id={id}
					type={type}
					name={name}
					value={values}
					className={`mt-1 block w-full p-2 ${
						borderless ? "" : "border border-gray-200 shadow-sm"
					} rounded-md focus:border-indigo-500 focus:ring-indigo-500  ${
						error ? "border-red-300" : ""
					}`}
					autoComplete={name}
					onChange={handleChange}
					placeholder={placeholder}
					readOnly={readonly}
					onBlur={handleBlur}
					accept={accept}
					icon={icon}
				/>
				{icon && (
					<label htmlFor={props?.id}>
						<FontAwesomeIcon
							icon={icon}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
						/>
					</label>
				)}
			</div>
			{(error || touched) && (
				<InputError message={error || touched} className='mt-2' />
			)}
		</div>
	);
};

export default Input;

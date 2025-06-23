"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Assuming this is your layout wrapper
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/Forn/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/components/Spinner";

const AuthPage = () => {
	const dispatch = useDispatch();
	const { processState, processMessage, processMessageFailed } = useSelector(
		(state) => state.process.default
	);
	const [showPassword, setShowPassword] = useState({
		password: false,
		passwordConfirm: false,
		passwordLogin: false,
		passwordMobileConfirm: false,
		passwordMobileLogin: false,
	});

	const [showDaftar, setShowDaftar] = useState(false);
	const toggleShowDaftar = () => setShowDaftar((prev) => !prev);

	const togglePassword = (field) => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.matches(
				/^[a-z0-9]*$/,
				"Username harus huruf kecil dan tidak boleh ada spasi"
			)
			.max(12, "Maksimal 12 huruf/angka")
			.required("Username harus diisi"),
		email: Yup.string()
			.email("Format email salah")
			.required("Email harus diisi"),
		password: Yup.string()
			// .min(6, "Minimum 6 characters")
			.required("Password harus diisi"),
		passwordConfirm: Yup.string()
			.oneOf([Yup.ref("password"), null], "Konfirmasi password harus sama")
			.required("Konfirmasi password wajib diisi"),
	});
	const validationSignIn = Yup.object({
		username: Yup.string().required("Username atau Email harus diisi"),
		password: Yup.string().required("Password harus diisi"),
	});

	const handleRegister = async (values) => {
		const form = new FormData();
		form.append("username", values.username);
		form.append("email", values.email);
		form.append("password", values.password);
		try {
			const resp = await sendDataGeneral({
				data: form,
				route: route("daftar"),
				prosesReducer: processStateReducer,
				messageFailedReducer: processMessageFailedReducer,
				dispatch: dispatch,
			});

			if (resp.status === 200) {
				// console.log(resp.data?.message?.success);
				// location.reload();s
				dispatch(processMessageReducer(resp.data?.message?.success));
				setShowDaftar(false);
			} else if (resp.status === 419) {
				dispatch(
					messageFailedReducer(
						"Session Anda habis, sistem akan reload halaman otomatis"
					)
				);
				setTimeout(() => location.reload(), 2000);
			}
			// Navigate to home only after successful authentication
		} catch (error) {
			// console.error("Authentication failed:", error);
			if (error.status === 419) {
				dispatch(
					messageFailedReducer(
						"Session Anda habis, sistem akan reload halaman otomatis"
					)
				);
				setTimeout(() => location.reload(), 2000);
			}
		}
	};

	const handleLogin = async (values) => {
		const form = new FormData();
		form.append("username", values.username);
		form.append("password", values.password);
		try {
			const resp = await sendDataGeneral({
				data: form,
				route: route("authenticate"),
				prosesReducer: spinnerProsesStateReducer,
				dispatch: dispatch,
				messageFailedReducer: messageFailedReducer,
			});

			// console.log(resp);
			if (resp.status === 200) {
				location.replace(route("home"));
			} else if (resp.status === 419) {
				dispatch(
					messageFailedReducer(
						"Session Anda habis, sistem akan reload halaman otomatis"
					)
				);
				setTimeout(() => location.reload(), 2000);
			}
			// Navigate to home only after successful authentication
		} catch (error) {
			// console.error("Authentication failed:", error);
			if (error.status === 419) {
				dispatch(
					messageFailedReducer(
						"Session Anda habis, sistem akan reload halaman otomatis"
					)
				);
				setTimeout(() => location.reload(), 2000);
			}
		}
		// Add API request for login
	};

	const MessageFailed = () => {
		return (
			processMessageFailed && (
				<div className='mb-4 text-sm font-medium text-danger'>
					{processMessageFailed}
				</div>
			)
		);
	};

	const LupaPassword = () => {
		const dispatch = useDispatch();
		const [show, setShow] = useState(false);
		const [showEditPw, setShowEditPw] = useState(false);
		const [encId, setEncId] = useState(null);
		const [msgNull, setMsgNull] = useState(null);
		const toggleShow = () => setShow(!show);
		const toggleShowEditPw = () => setShowEditPw(!showEditPw);

		const getUser = async (values) => {
			const form = new FormData();
			form.append("username", values.username);
			form.append("email", values.email);
			form.append("tanggal", values.tanggal);

			const respUser = await sendDataGeneral({
				data: form,
				route: route("password.lupa"),
				// prosesReducer: processStateReducer,
				// messageFailedReducer: processMessageFailedReducer,
				dispatch,
				waitUntilFinish: true,
				handleClose: () => toggleShowEditPw(),
			});

			if ([200, 201, 204].includes(respUser?.status)) {
				// setShowDaftar(false);
				toggleShowEditPw();
				setMsgNull(null);
				setEncId(respUser?.data);
			} else if (respUser?.status === 419) {
				dispatch(
					messageFailedReducer(
						"Session Anda habis, sistem akan reload halaman otomatis"
					)
				);
				setTimeout(() => location.reload(), 2000);
			} else {
				setMsgNull("Data tidak ditemukan");
			}
		};

		const [showPassword, setShowPassword] = useState({
			password: false,
			passwordConfirm: false,
		});

		const togglePassword = (field) => {
			setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
		};
		const validationSchema = Yup.object().shape({
			password: Yup.string()
				// .min(6, "Minimum 6 characters")
				.required("Password harus diisi"),
			passwordConfirm: Yup.string()
				.oneOf([Yup.ref("password"), null], "Konfirmasi password harus sama")
				.required("Konfirmasi password wajib diisi"),
		});
		const handleGantiPassword = async (data) => {
			const form = new FormData();
			form.append("user_id", encId);
			form.append("password", encLaravel(data.password));
			form.append("passwordConfirm", encLaravel(data.passwordConfirm));

			await sendDataGeneral({
				data: form,
				route: route("password.lupa.change"),
				prosesReducer: processStateReducer,
				messageFailedReducer: processMessageFailedReducer,
				dispatch,
				handleClose: () => {
					toggleShow();
					setShowEditPw(false);
				},
				waitUntilFinish: true,
			});
		};
		return (
			<>
				<button
					type='button'
					className='btn btn-outline-warning text-capitalize m-0 px-3 py-1'
					style={{ fontSize: "0.5 rem" }}
					onClick={toggleShow}>
					Lupa Password?
				</button>
				<ModalStatic
					show={show}
					handleClose={() => {
						toggleShow();
						toggleShowEditPw();
						setEncId("");
					}}>
					{msgNull && (
						<div className='text-center'>
							<span className='text-sm text-danger fw-bold'>
								Data tidak ditemukan
							</span>
						</div>
					)}
					{showEditPw && encId ? (
						<Formik
							initialValues={{
								password: "",
								passwordConfirm: "",
							}}
							validationSchema={validationSchema}
							onSubmit={(values) => handleGantiPassword(values)}>
							{({
								isSubmitting,
								errors,
								values,
								touched,
								handleSubmit,
								handleChange,
								handleBlur,
							}) => (
								<Form>
									<div className='text-center'>
										<span className='text-sm text-dark fw-bold'>
											Silakan Ganti Password Anda
										</span>
										<br />
									</div>
									<div className='position-relative col-12 mb-2'>
										<Input
											className='col-12'
											id={"password"}
											name={"password"}
											type={showPassword.password ? "text" : "password"}
											error={errors.password}
											touched={touched.password}
											values={values.password}
											handleBlur={handleBlur}
											handleChange={handleChange}
											placeholder='Password'
										/>
										<span
											type='button'
											className={`fa-solid fa-eye position-absolute end-0 top-50 translate-middle fs-6 ${
												errors.password ? "mt-n2" : "mt-0"
											}`}
											onClick={() => togglePassword("password")}></span>
									</div>
									<div className='position-relative col-12 mb-2'>
										<Input
											className='col-12'
											id={"passwordConfirm"}
											name={"passwordConfirm"}
											type={showPassword.passwordConfirm ? "text" : "password"}
											error={errors.passwordConfirm}
											touched={touched.passwordConfirm}
											values={values.passwordConfirm}
											handleBlur={handleBlur}
											handleChange={handleChange}
											placeholder='Ulangi Password'
										/>
										<span
											type='button'
											className={`fa-solid fa-eye position-absolute end-0 top-50 translate-middle fs-6 ${
												errors.passwordConfirm ? "mt-n2" : "mt-0"
											}`}
											onClick={() => togglePassword("passwordConfirm")}></span>
									</div>
									<div className='text-end'>
										<button
											type='submit'
											className='btn btn-primary mt-3'
											disabled={isSubmitting}>
											{isSubmitting ? <Spinner /> : "Ganti"}
										</button>
									</div>
								</Form>
							)}
						</Formik>
					) : (
						<Formik
							initialValues={{
								username: "",
								email: "",
								tanggal: "",
							}}
							validationSchema={Yup.object({
								email: Yup.string()
									.email("Format email salah")
									.required("Email harus diisi"),
								username: Yup.string().required("Wajib diisi"),
								tanggal: Yup.string().required("Tanggal daftar wajib diisi"),
							})}
							onSubmit={getUser}>
							{({
								isSubmitting,
								handleBlur,
								handleChange,
								handleSubmit,
								values,
								errors,
								touched,
							}) => (
								<Form>
									<div className='text-center'>
										<span className='text-sm text-dark fw-bold'>
											Silakan Konfirmasi Akun Anda
										</span>
										<br />
									</div>
									<MessageFailed />
									<Input
										className='col-12'
										id={"username"}
										name={"username"}
										error={errors.username}
										touched={touched.username}
										values={values.username}
										handleBlur={handleBlur}
										handleChange={handleChange}
										placeholder='Username'
									/>
									<Input
										className='col-12'
										id={"email"}
										type='email'
										name={"email"}
										error={errors.email}
										touched={touched.email}
										values={values.email}
										handleBlur={handleBlur}
										handleChange={handleChange}
										placeholder='Email'
									/>
									<Input
										className='col-12'
										label='Tanggal Mendaftar'
										id={"tanggal"}
										type='date'
										name={"tanggal"}
										error={errors.tanggal}
										touched={touched.tanggal}
										values={values.tanggal}
										handleBlur={handleBlur}
										handleChange={handleChange}
									/>
									<button
										type='submit'
										className='btn btn-dark mt-3'
										onClick={handleSubmit}
										disabled={isSubmitting}>
										{isSubmitting ? <Spinner /> : "Konfirm"}
									</button>
								</Form>
							)}
						</Formik>
					)}
				</ModalStatic>
			</>
		);
	};

	return (
		<div className='min-h-screen bg-[#f6f5f7] flex flex-col justify-center items-center '>
			<div className='bg-white rounded-[10px] shadow-lg grid grid-cols-1 md:grid-cols-2 w-full max-w-[768px] min-h-[480px] overflow-hidden relative'>
				<div className='bg-white flex flex-col justify-center items-center h-full text-center'>
					<Formik
						initialValues={{ username: "", password: "" }}
						validationSchema={validationSignIn}
						onSubmit={handleLogin}>
						{({
							isSubmitting,
							handleBlur,
							handleChange,
							handleSubmit,
							values,
							errors,
							touched,
						}) => (
							<Form>
								<h1 className='font-bold text-xl mb-4'>Sign In</h1>
								<MessageFailed />
								<Input
									id={"username"}
									name={"username"}
									error={errors.username}
									touched={touched.username}
									values={values.username}
									handleBlur={handleBlur}
									handleChange={handleChange}
									placeholder='Username'
								/>
								<div className='relative'>
									<Input
										id={"password"}
										name={"password"}
										type={showPassword.passwordLogin ? "text" : "password"}
										error={errors.password}
										touched={touched.password}
										values={values.password}
										handleBlur={handleBlur}
										handleChange={handleChange}
										placeholder='Password'
									/>
									<span
										type='button'
										className={`absolute top-1/4 inset-y-0 end-2 fs-6 ${
											errors.password ? "mt-n2" : "mt-0"
										}`}
										onClick={() => togglePassword("passwordLogin")}>
										<FontAwesomeIcon
											icon={showPassword.passwordLogin ? faEye : faEyeSlash}
										/>
									</span>
								</div>
								<button
									type='submit'
									className='btn btn-primary mt-3'
									onClick={handleSubmit}
									disabled={isSubmitting}>
									{isSubmitting ? <Spinner /> : "Sign In"}
								</button>
								{/* <LupaPassword />
								<br /> atau
								<a
									href='/auth/google'
									className='btn btn-dark text-xs font-weight-bold mx-auto p-2 mt-3'>
									<i className='fa-brands fa-google'></i> Gunakan Google
								</a> */}
							</Form>
						)}
					</Formik>
				</div>
				<div className='bg-white flex flex-col justify-center items-center px-[50px] h-full text-center'>
					<Formik
						initialValues={{
							username: "",
							email: "",
							password: "",
							passwordConfirm: "",
						}}
						validationSchema={validationSchema}
						onSubmit={handleRegister}>
						{({
							isSubmitting,
							errors,
							values,
							touched,
							handleSubmit,
							handleChange,
							handleBlur,
						}) => (
							<Form>
								<h4>Buat Akun</h4>

								<Input
									className='col-12 mt-3'
									id={"username"}
									name={"username"}
									error={errors.username}
									touched={touched.username}
									values={values.username}
									handleBlur={handleBlur}
									handleChange={handleChange}
									placeholder='Username'
								/>
								<Input
									className='col-12'
									id={"email"}
									type='email'
									name={"email"}
									error={errors.email}
									touched={touched.email}
									values={values.email}
									handleBlur={handleBlur}
									handleChange={handleChange}
									placeholder='Email'
								/>

								<div className='position-relative col-12'>
									<Input
										className='col-12'
										id={"password"}
										name={"password"}
										type={showPassword.password ? "text" : "password"}
										error={errors.password}
										touched={touched.password}
										values={values.password}
										handleBlur={handleBlur}
										handleChange={handleChange}
										placeholder='Password'
									/>
									<span
										type='button'
										className={`fa-solid fa-eye position-absolute end-0 top-50 translate-middle fs-6 ${
											errors.password ? "mt-n2" : "mt-0"
										}`}
										onClick={() => togglePassword("password")}></span>
								</div>
								<div className='position-relative col-12'>
									<Input
										className='col-12'
										id={"passwordConfirm"}
										name={"passwordConfirm"}
										type={showPassword.passwordConfirm ? "text" : "password"}
										error={errors.passwordConfirm}
										touched={touched.passwordConfirm}
										values={values.passwordConfirm}
										handleBlur={handleBlur}
										handleChange={handleChange}
										placeholder='Ulangi Password'
									/>
									<span
										type='button'
										className={`fa-solid fa-eye position-absolute end-0 top-50 translate-middle fs-6 ${
											errors.passwordConfirm ? "mt-n2" : "mt-0"
										}`}
										onClick={() => togglePassword("passwordConfirm")}></span>
								</div>

								<button
									type='submit'
									className='btn btn-primary mt-3'
									disabled={isSubmitting}>
									{isSubmitting ? <Spinner /> : "Sign Up"}
								</button>
							</Form>
						)}
					</Formik>
				</div>
				<div
					className={`absolute top-0 ${
						showDaftar ? "-translate-x-full" : "translate-x-0"
					} left-1/2 w-1/2 h-full z-[100] overflow-hidden transition-transform duration-500`}>
					<div className='bg-gradient-to-r from-primary to-primary2 text-white absolute left-[-100%] w-[200%] h-full transform transition-transform duration-500'>
						<div className='absolute top-0 left-[0] w-1/2 h-full flex flex-col justify-center items-center px-10 text-center transition-transform'>
							<h1 className='font-bold text-xl'>Welcome Back!</h1>
							<p className='text-sm font-light leading-5 tracking-[0.5px] my-5'>
								To keep connected with us please login with your personal info
							</p>
							<button className='bg-transparent border border-white text-white rounded-[20px] text-xs font-bold py-3 px-[45px] uppercase tracking-wide'>
								Sign In
							</button>
						</div>
						<div className='absolute top-0 right-[0] w-1/2 h-full flex flex-col justify-center items-center px-10 text-center transition-transform'>
							<h1 className='font-bold text-xl'>Hello, Friend!</h1>
							<p className='text-sm font-light leading-5 tracking-[0.5px] my-5'>
								Enter your personal details and start journey with us
							</p>
							<button
								className='btn border-white border hover:bg-white/30 uppercase tracking-wide'
								onClick={toggleShowDaftar}>
								{showDaftar ? "Log In" : "Daftar"}
							</button>
						</div>
					</div>
				</div>
			</div>

			<footer className='fixed bottom-0 left-0 right-0 text-sm text-center z-[999]'>
				<p className='my-2'>
					Created by
					<a href='#' className='text-[#3c97bf]'>
						Fikar M. Istiqlalulwathon
					</a>
				</p>
			</footer>
		</div>
	);
};

export default AuthPage;

const { faSpinner } = require("@fortawesome/free-solid-svg-icons");
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome");

const Spinner = () => {
	return <FontAwesomeIcon icon={faSpinner} className='animate-spin text-lg' />;
};

export default Spinner;

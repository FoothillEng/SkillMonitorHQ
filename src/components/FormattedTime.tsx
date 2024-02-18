interface FormattedTimeProps {
    prependedString?: string;
    milliseconds: number;
    extraStyles?: string;
}
// returns a string in the format of "HH:MM:SS". If seconds, minutes, or hours are less than 10, a 0 is prepended to the string.
const FormattedTime = ({
    prependedString,
    milliseconds,
    extraStyles
}: FormattedTimeProps) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedSeconds = seconds % 60;
    const formattedMinutes = minutes % 60;
    const formattedHours = hours % 60;

    return (
        <span className={extraStyles}>
            {(prependedString ? prependedString : '') +
                (formattedHours < 10 ? '0' : '') +
                formattedHours +
                ':' +
                (formattedMinutes < 10 ? '0' : '') +
                formattedMinutes +
                ':' +
                (formattedSeconds < 10 ? '0' : '') +
                formattedSeconds}
        </span>
    );
};

export default FormattedTime;

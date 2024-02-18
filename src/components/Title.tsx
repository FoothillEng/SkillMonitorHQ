interface TitleProps {
    title: string;
}

const Title = ({ title }: TitleProps) => {
    return (
        <div
            id="title"
            className="mb-[3rem] text-center  text-6xl text-primary-400"
        >
            {title}
        </div>
    );
};

export default Title;

// mb-[3rem]

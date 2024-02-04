interface TitleProps {
    title: string;
}

const Title = ({ title }: TitleProps) => {
    return (
        <div
            id="title"
            className="fixed left-0 right-0 top-[13rem] text-center text-6xl"
        >
            {title}
        </div>
    );
};

export default Title;

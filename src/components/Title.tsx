interface TitleProps {
    title: string;
}

const Title = ({ title }: TitleProps) => {
    return <div className="fixed top-[13rem] text-6xl">{title}</div>;
};

export default Title;

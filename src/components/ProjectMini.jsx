const ProjectMini = ({image, title, description, link}) => {
    return (
        <div className="w-72 mx-10 my-3">
        <a href={link} target="_blank">
        <div
            className="w-full h-40 rounded-3xl shadow-md hover:shadow-xl transition-shadow-transform duration-300 hover:scale-110 overflow-hidden">
            <img src={`/assets/${image}`} alt=""
            className="object-cover object-left h-full w-full scale-110 transition-transform duration-300 hover:scale-100" />
        </div>
        </a>
        <div className="text-2xl mt-2">{title}</div>
        <div>
            {description}
        </div>
    </div>
  )
}

export default ProjectMini;
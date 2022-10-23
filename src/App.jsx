import ProjectMini from "./components/ProjectMini";


const App = () => {
  return (
    <div className="flex flex-col justify-center text-center text-lg bg-darker-primary text-white">
      <div className="mt-4 mx-auto">
        <div style={{ background: "url(/assets/circle.svg)", backgroundSize: "contain" }}
          className="w-64 h-64 absolute animate-spin-slow"></div>
        <div style={{ background: "url(/assets/circle.svg)", backgroundSize: "contain" }}
          className="w-64 h-64 absolute animate-spin-slower-reverse opacity-50"></div>
        <div style={{ background: "url(/assets/xarius.webp)", backgroundSize: "contain" }} className="w-48 h-48 m-8 rounded-full"
          alt="Profile picture"></div>
      </div>
      <h1 className="text-5xl my-5">Hi! I'm Xarius.</h1>
      <div className="flex flex-row justify-center">
        <a href="https://github.com/XariusExcl">
          <img src="assets/octocat.svg" alt="GitHub octocat" className="w-10 mx-3" />
        </a>
        <div className="text-3xl">•</div>
        <a href="https://twitter.com/XariusExcl">
          <img src="assets/twitter.svg" alt="Twitter Logo" className="w-10 mx-3" />
        </a>
      </div>
      <div className="text-base mt-4">C# • Unity • VR • PHP • TypeScript • 3D • GLSL</div>
      <h2 className="text-3xl my-5">• Projects •</h2>
      <div className="flex justify-center">
        <div className="flex mt-5">
          <ProjectMini
            image={"tn_echo.png"}
            title={"Echo (Game)"}
            description={"Entry for Ludum Dare 51 Game Jam : \"Every 10 seconds\""}
            link={"https://plumie.itch.io/echo"}
          />
          <ProjectMini
            image={"tn_wrecklessbar.png"}
            title={"Wreckless Bar (Game)"}
            description={"Entry for Ludum Dare 49 Game Jam : \"Unstable\""}
            link={"https://plumie.itch.io/wreckless-bar"}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex mt-5">
          <ProjectMini
            image={"tn_learninglab.webp"}
            title={"The Learning Lab (Design)"}
            description={"Design of a coworking space for students."}
            link={"assets/learninglab.png"}
          />
          <ProjectMini
            image={"tn_nullbyte.webp"}
            title={"NULL_BYTE (Game)"}
            description={"Entry for Ludum Dare 48 Game Jam : \"Deeper and deeper\""}
            link={"https://s4b4t3r.itch.io/nullbyte"}
          />
        </div>
      </div>
      <div className="text-primary mt-5">More...</div>
      <h2 className="text-3xl my-5">• About •</h2>
      <div>👋 Hi! I’m Xarius. I’ve been passionate about game development since 2017, ever since I first picked up
        Unity.<br />
        I studied web development in university, both frontend and backend.<br />
        I experiment in many domains, mainly shaders and 3D modeling at the moment.</div>
      <h2 className="text-3xl my-5">• Contact •</h2>
      <div>To be determined!</div>
    </div>
  );
}

export default App;

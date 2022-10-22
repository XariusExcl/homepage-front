const App = () => {
  return (
    <div className="flex flex-col justify-center text-center text-lg bg-darker-primary text-white">
      <div className="mt-4 mx-auto">
        <div style={{background:"url(/assets/circle.svg)", backgroundSize:"contain"}}
          className="w-64 h-64 absolute animate-spin-slow"></div>
        <div style={{background:"url(/assets/circle.svg)", backgroundSize:"contain"}}
          className="w-64 h-64 absolute animate-spin-slower-reverse opacity-50"></div>
        <div style={{background:"url(/assets/xarius.webp)", backgroundSize: "contain"}} className="w-48 h-48 m-8 rounded-full"
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
          <div className="w-72 mx-10">
            <a href="https://plumie.itch.io/echo" target="_blank">
              <div
                className="w-full h-40 rounded-3xl shadow-md hover:shadow-xl transition-shadow-transform duration-300 hover:scale-110 overflow-hidden">
                <img src="/assets/tn_echo.png" alt=""
                  className="object-cover object-left h-full w-full scale-110 transition-transform duration-300 hover:scale-100" />
              </div>
            </a>
            <div className="text-2xl mt-2">Echo (Game)</div>
            <div>
              Entry for Ludum Dare 51 Game Jam : "Every 10 seconds"
            </div>
          </div>
          <div className="w-72 mx-10">
            <a href="https://plumie.itch.io/wreckless-bar" target="_blank">
              <div
                className="w-full h-40 rounded-3xl shadow-md hover:shadow-xl transition-shadow-transform duration-300 hover:scale-110 overflow-hidden">
                <img src="/assets/tn_wrecklessbar.png" alt=""
                  className="object-cover object-left h-full w-full scale-110 transition-transform duration-300 hover:scale-100" />
              </div>
            </a>
            <div className="text-2xl mt-2">Wreckless Bar (Game)</div>
            <div>
              Entry for Ludum Dare 49 Game Jam : "Unstable"
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex mt-5">
          <div className="w-72 mx-10">
            <a href="assets/learninglab.png" target="_blank">
              <div
                className="w-full h-40 rounded-3xl shadow-md hover:shadow-xl transition-shadow-transform duration-300 hover:scale-110 overflow-hidden">
                <img src="/assets/tn_learninglab.webp" alt=""
                  className="object-cover object-left h-full w-full scale-110 transition-transform duration-300 hover:scale-100" />
              </div>
            </a>
            <div className="text-2xl mt-2">The Learning Lab (Design)</div>
            <div>
              Design of a coworking space for students.
            </div>
          </div>
          <div className="w-72 mx-10">
            <a href="https://s4b4t3r.itch.io/nullbyte" target="_blank">
              <div
                className="w-full h-40 rounded-3xl shadow-md hover:shadow-xl transition-shadow-transform duration-300 hover:scale-110 overflow-hidden">
                <img src="/assets/tn_nullbyte.webp" alt=""
                  className="object-cover object-left h-full w-full scale-110 transition-transform duration-300 hover:scale-100" />
              </div>
            </a>
            <div className="text-2xl mt-2">NULL_BYTE (Game)</div>
            <div>
              Entry for Ludum Dare 48 Game Jam : "Deeper and deeper"
            </div>
          </div>
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

import { useNavigate } from "react-router-dom";
import { FileHandler } from "sim-spoms/src/models/fileHandler";
export default function Home() {
  // const [patchesData, setPatchesData] = useState([]);
  const navigate = useNavigate();

  const loadFileNetwork = (e: any) => {
    const acceptedExtensions = ["json", "csv"]
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = () => {
      if (!fileReader.result) return;
      if (fileReader.result instanceof ArrayBuffer) return; // ?
      const extension = e.target.files[0].name.split(".").pop()
      console.log(extension)
      if(acceptedExtensions.includes(extension))
      {
        const spomOptions = FileHandler.textToConfig(fileReader.result,extension);
        navigate("/action", { state: { spomOptions: spomOptions } });
      }
      else{
        return;
      }
    };
  };
  const loadEmptyNetwork = () => {
    navigate("/action", { state: { spomOptions: {} } });
  };

  return (
    <section className="h-screen bg-white ">
      <div className="flex flex-col items-center justify-center h-full gap-10 text-shadow">
        <h1 className="text-main-blue text-8xl font-bold">V-SPOMs</h1>
        <div className="flex flex-col w-auto items-center gap-5  text-xl text-white">
          <div
            className="bg-main-blue w-full rounded-box hover:bg-dark-blue shadow-md shadow-dark-blue cursor-pointer"
            onClick={loadEmptyNetwork}
          >
            <div className="m-5 text-center">New Scenario</div>
          </div>
          <h3 className="text-dark-blue">OR</h3>
          <div className="bg-main-blue w-full rounded-box shadow-md hover:bg-dark-blue shadow-dark-blue cursor-pointer">
            <div className="m-5 flex flex-col justify-center items-center gap-3 ">
              <form className="flex flex-col items-center gap-3 ">
                <label>
                  <input
                    type="file"
                    className="hidden"
                    onChange={loadFileNetwork}
                  />
                  <p className="hover: cursor-pointer ">Upload Scenario</p>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

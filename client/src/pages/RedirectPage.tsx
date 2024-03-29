/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RedirectPage = () => {
  const { shortUrl } = useParams();
  const [msg, setMsg] = useState<string>("Redirecting...");
  const [isProtected, setIsProtected] = useState(false);
  const [url, seturl] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");

  const fetchOriginalUrl = async () => {
    const res = await axios
      .get(`https://shortify-server-surajdarade.vercel.app/api/urls/${shortUrl}`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
        setMsg("Invalid URL or URL has been expired!");
        return "";
      });
    console.log(res);

    if (res !== undefined) {
      if (res.pass === false) {
        window.location.replace(res.url);
      } else {
        seturl(res.url);
        setIsProtected(true);
      }
    }
  };

  const onPasswordSubmit = async () => {
    const res = await axios
      .post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/urls/check/pass`, {
        pass: password,
        shortify: shortUrl,
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
        setPassError("Invalid password!");
        return "";
      });

    if (res === true) {
      setIsProtected(false);
      window.location.replace(url);
    } else {
      setPassError("Invalid password!");
    }
  };

  useEffect(() => {
    fetchOriginalUrl();
  }, []);

  if (isProtected) {
    return (
      <div className="h-screen w-screen flex flex-col text-2xl text-blue-500 items-center jce">
        <div className="flex-flex-col m-auto items-center justify-center pb-32">
          <div className="mb-24 text-red-600">
            This link is password protected
          </div>

          <div className="mt-4 text-lg text-center">
            Enter the password to continue
          </div>
          <div className="mt-4">
            <Input
              className="border-2 border-blue-500 rounded-md p-1 text-white"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPassError("");
              } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}            />
          </div>
          <div className="mt-2 text-red-500 text-sm font-semithin">
            {passError}
          </div>
          <Button
            className="w-full mt-6"
            variant="gradient"
            color="blue"
            onClick={onPasswordSubmit} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            <span>Continue</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col text-2xl text-blue-500 items-center jce">
      <div className="m-auto">{msg}</div>
    </div>
  );
};

export default RedirectPage;

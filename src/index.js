import * as React from "react";
import { createRoot } from "react-dom/client";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Home } from "./Home";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
let init = false;

/**
 * Runs `callback` shortly after the next browser Frame is produced.
 */
function runAfterFramePaint(callback) {
  // Queue a "before Render Steps" callback via requestAnimationFrame.
  requestAnimationFrame(() => {
    const messageChannel = new MessageChannel();

    // Setup the callback to run in a Task
    messageChannel.port1.onmessage = callback;

    // Queue the Task on the Task Queue
    messageChannel.port2.postMessage(undefined);
  });
}

const onPageChange = () => {
  if (init) {
    return;
  }
  let url = window.location.href;

  ["click"].forEach((evt) =>
    window.addEventListener(
      evt,
      function () {
        console.log("start", performance.now());

        performance.mark("App_Start");

        // Queues a requestAnimationFrame relative to this executing Task

        requestAnimationFrame(() => {
          if (url !== location.href) {
            // do stuff
            console.log(`URL changed to ${location.href}`);

            // Queues a requestAnimationFrame relative to this executing Task
            runAfterFramePaint(() => {
              console.log("end", performance.now());

              performance.mark("App_FrameProduced");

              const measure = performance.measure(
                "FrameTime",
                "App_Start",
                "App_FrameProduced"
              );

              console.log(
                `The Frame was produced after ${measure?.duration}ms`
              );
            });
            // performance.mark('App_FrameProduced');

            // const measure = performance.measure(
            //   'FrameTime',
            //   'App_Start',
            //   'App_FrameProduced'
            // );

            // console.log(`The Frame was produced after ${measure.duration}ms`);
          }
          url = location.href;
        });
      },
      true
    )
  );
  init = true;
};

onPageChange();

root.render(
  <div>
    <BrowserRouter>
      <nav>
        <Link to="/home">/home</Link>
        <br />
        <Link to="/">/</Link>
      </nav>

      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<App />}>
          {/* <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </div>

  // <StrictMode>
  //   <App />
  // </StrictMode>
);

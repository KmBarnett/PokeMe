import React, { useRef, useState, useEffect } from "react";
import "./PokeDex.css";

function PokeDex() {
  const [imgExists, takeImg] = useState(false);
  const [isScanning, setScan] = useState(false);
  const [allPokemon, setPokedex] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const videoPlayer = useRef(null);
  const canvas = useRef(null);

  const typesColor = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  const getSpecies = async (pokemon) => {
    const res = await fetch(pokemon.species.url);
    const data = await res.json();
    return data.id;
  };

  const getPokemon = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=964");
    const data = await res.json();
    const pokedex = data.results;
    pokedex.forEach(async (pokemon) => {
      let res = await fetch(pokemon.url);
      let data = await res.json();
      pokemon.data = {
        type: data.types.map((item) => item.type.name),
        id: await getSpecies(data),
      };
    });
    setPokedex(pokedex);
  };

  const randomPokemon = () => {
    return Math.floor(Math.random() * allPokemon.length);
  };

  const processDevices = (devices) => {
    devices.forEach((device) => {
      setDevice(device);
    });
  };

  const setDevice = async (device) => {
    const { deviceId } = device;
    await navigator.mediaDevices
      .getUserMedia({ audio: false, video: { deviceId } })
      .then((stream) => (videoPlayer.current.srcObject = stream))
      .catch((err) => console.log(err));
    let playPromise = videoPlayer.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.  
          setScan(true);
          setTimeout(takePhoto, 3000);
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          console.log("playback prevented");
        });
    }
  };

  const turnCameraOff = () => {
    console.log("ran", videoPlayer.current.srcObject.getVideoTracks());
    videoPlayer.current.srcObject
      .getVideoTracks()
      .forEach((track) => {
          track.stop();
      });
  };

  const takePhoto = () => {
    setPokemon(randomPokemon());
    setScan(false);
    const context = canvas.current.getContext("2d");
    context.drawImage(
      videoPlayer.current,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    turnCameraOff()
    takeImg(true);
  };

  const scan = async () => {
    takeImg(false);
    setPokemon(null);
    const cameras = await navigator.mediaDevices.enumerateDevices();
    processDevices(cameras);
  };

  useEffect(() => {
    getPokemon();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="pokeindex">
      <div className="pokeindex-left">
        <div className="pokeindex-left__top">
          <div className="circle-big"></div>
          <div className="circle-small"></div>
        </div>
        <div className="pokeindex-left__screen">
          <div className="dots">
            <span></span>
            <span></span>
          </div>
          <div className="screen">
            <video
              style={{ display: !imgExists ? "initial" : "none" }}
              ref={videoPlayer}
            />
            <canvas
              className="canvas screen"
              style={{ display: imgExists ? "initial" : "none" }}
              ref={canvas}
            />
            {isScanning && (
              <div className="diode">
                <div className="laser"></div>
              </div>
            )}
          </div>
          <div className="status">
            <div className="status-light"></div>
            <div className="status-sound">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="pokeindex-left__buttons">
          <div className="buttons">
            <div className="buttons-circle"></div>
            <div className="buttons-quad">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="controller">
            {allPokemon.length > 0 ? (
              <button onClick={scan} className="controller-touch">
                Scan
              </button>
            ) : (
              <button disabled className="controller-touch">
                Loading...
              </button>
            )}
            <div className="controller-joystick"></div>
          </div>
        </div>
      </div>
      <div className="pokeindex-middle"></div>
      <div className="pokeindex-right">
        {pokemon !== null ? (
          <div className="pokeindex-right__screen">
            <h2>{allPokemon[pokemon].name}</h2>
            <div className="poke-info">
              <h3>#{allPokemon[pokemon].data.id}</h3>
              <div className="types">
                {allPokemon[pokemon].data.type.map((type) => (
                  <h3 key={type} style={{ background: typesColor[type] }}>
                    {type}
                  </h3>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pokeindex-right__screen"></div>
        )}
        <div className="pokeindex-right__buttons">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="pokeindex-right__buttons-quadruple">
          <div className="dot">
            <span></span>
            <span></span>
          </div>
          <div className="button">
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="pokeindex-right__buttons-triple">
          <div className="button">
            <span></span>
            <span></span>
          </div>
          <div className="light"></div>
        </div>
        <div className="pokeindex-right__buttons-double">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default PokeDex;

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsFillVolumeMuteFill } from "react-icons/bs";
import { useSongContext } from '../Context/SongContext';
import { Link } from 'react-router-dom';
import logo from '../Image/logo-removebg-preview.png'

const MusicPlayer = () => {
    const [volume, setVolume] = useState(50); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(new Audio());
    const { selectedSong } = useSongContext();

    useEffect(() => {
        const audio = audioRef.current;

        const playMusic = async () => {
            if (selectedSong) {
                try {
                    await audio.pause();
                    audio.src = selectedSong.url;
                    await audio.load();
                    await audio.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.error('Failed to play music:', error);
                }
            }
        };

        playMusic();

        return () => {
            audio.pause();
            setIsPlaying(false);
        };
    }, [selectedSong]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (event) => {
        const volumeValue = event.target.value;
        setVolume(volumeValue);
        audioRef.current.volume = volumeValue / 100;
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeekChange = (event) => {
        audioRef.current.currentTime = event.target.value;
        setCurrentTime(event.target.value);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [volume]);

    return (
        <div>
            <div className='w-full bg-neutral-900  h-20 flex items-center justify-between px-4'>
                <div className='flex items-center space-x-4'>
                    <img src={selectedSong?.image || logo } alt={selectedSong?.name || logo} className="w-16 h-16 rounded-md" />
                    <div className="text-white w-40">
                        <p className="font-semibold text-ellipsis line-clamp-1">{selectedSong?.name}</p>
                        <p className="text-gray-400 text-ellipsis line-clamp-1">{selectedSong?.artist || ''}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center -ml-24 space-y-2">
                    <div className="flex items-center space-x-4">
                        <button className="text-white">
                            <FaChevronLeft className="text-2xl" />
                        </button>
                        <button className="text-white" onClick={togglePlayPause}>
                            {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl" />}
                        </button>
                        <button className="text-white">
                            <FaChevronRight className="text-2xl" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-white">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeekChange}
                            className="w-64 h-1 rounded-full outline-none"
                        />
                        <span className="text-white">{formatTime(duration)}</span>
                    </div>
                </div>
                <div>
                    <div className="relative flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="appearance-none w-20 h-1 bg-white rounded-full outline-none opacity-70 transition-opacity duration-200"
                        />
                        <div className="absolute -ml-8">
                            {volume === 0 && <BsFillVolumeMuteFill className="text-white text-xl" />}
                            {volume > 0 && volume <= 50 && <FaVolumeDown className="text-white text-xl" />}
                            {volume > 50 && <FaVolumeUp className="text-white text-xl" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;

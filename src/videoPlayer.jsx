import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

function VideoPlayer() {
    const videoRef = useRef(null);
    const [selectedQuality, setSelectedQuality] = useState('master_playlist.m3u8');
    const [hls, setHls] = useState(null);

    useEffect(() => {
        if (Hls.isSupported()) {
            const newHls = new Hls();
            setHls(newHls);
            if (videoRef.current) {
                newHls.loadSource(`assets/${selectedQuality}`);
                newHls.attachMedia(videoRef.current);
            }
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = `assets/${selectedQuality}`;
        }
    }, [selectedQuality]);

    const handleQualityChange = (event) => {
        setSelectedQuality(event.target.value);
    };

    const changeQuality = () => {
        if (hls) {
            hls.loadSource(`assets/${selectedQuality}`);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                hls.attachMedia(videoRef.current);
                videoRef.current.play();
            });
        } else {
            videoRef.current.src = `assets/${selectedQuality}`;
            videoRef.current.play();
        }
    };
    

    return (
        <div>
            <video id="videoPlayer" controls ref={videoRef}>
                Your browser does not support the video tag.
            </video>

            <div id="qualitySelector">
                <label htmlFor="quality">Select Quality:</label>
                <select id="quality" onChange={handleQualityChange} value={selectedQuality}>
                    <option value="master_playlist.m3u8">Default</option>
                    <option value="output_144p.m3u8">144p</option>
                    <option value="output_360.m3u8">360p</option>
                    <option value="output_720.m3u8">720p</option>
                </select>
                <button onClick={changeQuality}>Change</button>
            </div>
        </div>
    );
}

export default VideoPlayer;

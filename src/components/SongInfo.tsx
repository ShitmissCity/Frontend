import React from "react";
import { Map } from "../entity";
import { getMapTypeColor, getMapTypeString } from "../entity/MapPoolAndScores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useRequest } from "./Request";
import "./SongInfo.scss";

export default function SongInfo(params: { map: Map, index?: React.Key, fullStyle: boolean, additionalContent?: React.ReactNode }) {
    var map = params.map;
    const { scoresaberSvg } = useRequest();
    return (
        <div className="card rounded" key={params.index} style={{ background: `linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL})`, backgroundSize: "cover" }}>
            <div className="row g-0">
                {params.fullStyle && <div className="col-sm-3">
                    <img src={map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL} alt="Map Thumbnail" className="img-fluid rounded-start" style={{ background: `border-radius: 0px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)`, aspectRatio: "1 / 1", objectFit: "cover" }} />
                </div>}
                {!params.fullStyle && <div style={{ height: 256, flex: 0, aspectRatio: "1 / 1" }}><img src={map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL} alt="Map Thumbnail" className="img-fluid rounded-start" style={{ background: `border-radius: 0px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)`, aspectRatio: "1 / 1", objectFit: "contain", width: "100%", height: "100%" }} /></div>}
                <div className={"ps-2 col-sm-" + (params.fullStyle ? "9" : "3")} style={{ flex: "0 0 auto" }}>
                    <div className="card-body d-flex flex-column">
                        <p className="title" style={{ fontSize: "2.5vh", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 0, lineHeight: "40px" }}>
                            <a href={`https://beatsaver.com/maps/${map.song_id}`}>
                                {map.beatsaver.metadata.songName}
                            </a>
                        </p>
                        <span style={{ width: "100%", color: "#8c8c8c", wordWrap: "normal", whiteSpace: "break-spaces", lineHeight: "24px" }}>
                            Song by: {map.beatsaver.metadata.songAuthorName}
                        </span>
                        <span style={{ width: "100%", color: "#8c8c8c", wordWrap: "normal", whiteSpace: "break-spaces", lineHeight: "24px" }}>
                            Mapped by: {map.beatsaver.metadata.levelAuthorName}
                        </span>
                        <div style={{ marginTop: ".1rem", display: "flex", lineHeight: "24px" }}>
                            <span className="badge" style={{ backgroundColor: getMapTypeColor(map.type), color: "white", fontFamily: "Segoe UI", lineHeight: "unset", paddingTop: 0, paddingBottom: 0 }}>{getMapTypeString(map.type)}</span>
                            <a data-tooltip="One Click" href={`beatsaver://${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("download")} /></a>
                            <a data-tooltip="BeatSaver" href={`https://beatsaver.com/maps/${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("compact-disc")} /></a>
                            <a data-tooltip="+1 Rabbit Viewer" href={`https://skystudioapps.com/bs-viewer/?id=${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("eye")} /></a>
                            <a href={`https://scoresaber.com/leaderboard/${map.scoresaber_id}`} style={{ marginLeft: 14, display: "inline-block" }}><div style={{ width: 24, marginTop: -4 }} dangerouslySetInnerHTML={{ __html: scoresaberSvg }}></div></a>
                        </div>
                    </div>
                </div>
                {params.additionalContent}
            </div>
        </div>
    );
}
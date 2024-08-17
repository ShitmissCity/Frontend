import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Auth";
import BackgroundContainer from "../components/Background";
import { useRequest } from "../components/Request";
import { useTitle } from "../components/Title";
import { ToastType, useToast } from "../components/Toast";
import { Team } from "../entity";


export default function Settings() {
    const [twitchName, setTwitchName] = useState("");
    const [scoresaberId, setScoresaberId] = useState("");
    const { user, login } = useAuth();
    const [team, setTeam] = useState(user.team);
    const [teamName, setTeamName] = useState((user.team && user.team.name) || "");
    const [teamColor, setTeamColor] = useState((user.team && HexToRGB(user.team.color)) || 0);
    const [teamImg, setTeamImg] = useState((user.team && user.team.avatar_url) || "/img/icon-256.png");
    const { setTitle } = useTitle();
    const { showToast } = useToast();
    const getUrl = useRequest().getUrl;
    const [sent, setSent] = useState(true);
    const [teamSent, setTeamSent] = useState(true);
    const [invite, setInvite] = useState("");
    const [inviteSent, setInviteSent] = useState(true);

    useEffect(() => {
        setTitle("Settings");
    }, [setTitle]);

    useEffect(() => {
        if (user) {
            setTwitchName(user.twitch_name);
            setScoresaberId(user.scoresaber_id);
            getUrl('/authorized/team').then(res => {
                if (res.ok) {
                    res.json().then((data: Team) => {
                        setTeam(data);
                    });
                }
                else {
                    showToast("Failed to load team members", "Team Settings", ToastType.Error);
                }
            });
        }
    }, [user]);

    function TeamColorHex() {
        return RGBtoHex((teamColor >> 16) & 0xff, (teamColor >> 8) & 0xff, teamColor & 0xff);
    }

    function RGBtoHex(r: number, g: number, b: number) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function HexToRGB(hex: string) {
        hex = hex.replace("#", "");
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return (r << 16) | (g << 8) | b;
    }

    function copyDiscordId() {
        navigator.clipboard.writeText(user.discord_id);
    }

    async function saveUserSettings(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        const formElements = form.currentTarget.elements as any;
        const twitchName = formElements.twitchName.value;
        const scoresaberId = formElements.scoresaberId.value;
        let resp = await getUrl("/authorized/user/update", { method: "POST", body: JSON.stringify({ twitch_name: twitchName, scoresaber_id: scoresaberId }), headers: { "Content-Type": "application/json" } });
        if (resp.ok) {
            login();
            setSent(true);
        }
        else {
            var err = await resp.text();
            try {
                err = JSON.parse(err).error;
            }
            catch {
            }
            showToast(err, "Team Settings", ToastType.Error);
        }
    }

    async function createTeam(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        const formElements = form.currentTarget.elements as any;
        const teamName = formElements.teamname.value;
        const teamColor = formElements.teamColorHex.value;
        const teamImg = formElements.teamImg.value;
        if (!teamName || !teamColor || !teamImg) {
            showToast("Please fill out all fields", "Team Settings", ToastType.Error);
            return;
        }
        var resp = await getUrl("/authorized/team/create", { method: "POST", body: JSON.stringify({ name: teamName, color: teamColor, img: teamImg }), headers: { "Content-Type": "application/json" } });
        if (resp.ok) {
            login();
            setTeamSent(true);
        }
        else {
            var err = await resp.text();
            try {
                err = JSON.parse(err).error;
            }
            catch {
            }
            showToast(err, "Team Settings", ToastType.Error);
        }
    }

    async function updateTeam(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        const formElements = form.currentTarget.elements as any;
        const teamName = formElements.teamname.value;
        const teamColor = formElements.teamColorHex.value;
        const teamImg = formElements.teamImg.value;
        if (!teamName || !teamColor || !teamImg) {
            showToast("Please fill out all fields", "Team Settings", ToastType.Error);
            return;
        }
        var resp = await getUrl("/authorized/team/update", { method: "POST", body: JSON.stringify({ name: teamName, color: teamColor, img: teamImg }), headers: { "Content-Type": "application/json" } });
        if (resp.ok) {
            login();
            setTeamSent(true);
        }
        else {
            var err = await resp.text();
            try {
                err = JSON.parse(err).error;
            }
            catch {
            }
            showToast(err, "Team Settings", ToastType.Error);
        }
    }

    async function sendInvite(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        if (!invite) {
            showToast("Please enter a scoresaber id", "Team Settings", ToastType.Error);
            return;
        }
        var resp = await getUrl("/authorized/invitations/send/" + invite, { method: "PUT" });
        if (resp.ok) {
            setInviteSent(true);
            setInvite("");
        }
        else {
            var err = await resp.text();
            try {
                err = JSON.parse(err).error;
            }
            catch {
            }
            showToast(err, "Team Settings", ToastType.Error);
        }
    }

    function onInputChange(input: React.ChangeEvent<HTMLInputElement>) {
        const name = input.currentTarget.id;
        let value = input.currentTarget.value;
        switch (name) {
            case "teamname":
                setTeamName(value);
                break;
            case "scoresaberId":
                if (/http/.test(value)) {
                    value = value.substring(value.lastIndexOf("/") + 1);
                }
                setScoresaberId(value);
                break;
            case "twitchName":
                setTwitchName(value);
                break;
            case "teamColorHex":
                let hex = value.replace("#", "");
                let r = parseInt(hex.substring(0, 2), 16);
                let g = parseInt(hex.substring(2, 4), 16);
                let b = parseInt(hex.substring(4, 6), 16);
                setTeamColor((r << 16) | (g << 8) | b);
                break;
            case "teamImg":
                setTeamImg(value);
                break;
            case "inviteCode":
                if (/http/.test(value)) {
                    value = value.substring(value.lastIndexOf("/") + 1);
                }
                setInvite(value);
                break;
        }
    }

    function userFormChanged() {
        setSent(false);
    }

    function createTeamChanged() {
        var img = new Image();
        img.src = teamImg;
        img.onload = () => {
            if (img.width >= 256 && img.height >= 256 && img.width === img.height)
                setTeamSent(false);
            else
                showToast("Team image must be a square image with a minimum width and height of 256px", "Team Settings", ToastType.Error);
        }
    }

    function teamFormChanged() {
        var img = new Image();
        img.src = teamImg;
        img.onload = () => {
            if (img.width >= 256 && img.height >= 256 && img.width === img.height)
                setTeamSent(false);
            else
                showToast("Team image must be a square image with a minimum width and height of 256px", "Team Settings", ToastType.Error);
        }
    }

    function inviteFormChanged() {
        setInviteSent(false);
    }

    return (
        <>
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Settings
                        </h1>
                    </div>
                </div>
            </BackgroundContainer>
            <section className="section app-background">
                <div className="container-fluid transition theme-color d-flex justify-content-between">
                    <div className="col-3">
                        <h1>User Settings</h1>
                        <form onSubmit={saveUserSettings} onChange={userFormChanged}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Username" disabled value={user.username} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="discordId">Discord ID</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="discordId" placeholder="Discord ID" disabled value={user.discord_id} />
                                    <button className="btn btn-outline-primary" type="button" onClick={copyDiscordId}>Copy</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="twitchName">Twitch Name</label>
                                <input type="text" className="form-control" id="twitchName" placeholder="Twitch Name" value={twitchName} onChange={onInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="scoresaberId">ScoreSaber ID</label>
                                <input type="text" className="form-control" id="scoresaberId" placeholder="Twitch ID" value={scoresaberId} onChange={onInputChange} />
                            </div>
                            {!sent && <button type="submit" className="btn btn-primary mt-2">Save</button>}
                            {sent && <button type="submit" className="btn btn-success mt-2" disabled>Saved</button>}
                        </form>
                    </div>
                    <div className="col-4">
                        <h1>Team Settings</h1>
                        {!user.team && user.scoresaber_id && user.twitch_name &&
                            (<form onSubmit={createTeam} onChange={createTeamChanged}>
                                <div className="form-group">
                                    <label htmlFor="teamname">Team Name</label>
                                    <input type="text" className="form-control" id="teamname" placeholder="Team Name" value={teamName} onChange={onInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Team Color</label>
                                    <input type="color" className="form-control form-control-color p-0 border-0" style={{ backgroundColor: "transparent" }} id="teamColorHex" value={TeamColorHex()} onChange={onInputChange} />
                                </div>
                                <div className="row">
                                    <div className="form-group flex-grow-1 " style={{ width: "auto" }}>
                                        <label htmlFor="teamImg">Team Image</label>
                                        <input type="text" className="form-control" id="teamImg" value={teamImg} onChange={onInputChange} />
                                    </div>
                                    <div style={{ width: 128, height: 128, padding: 0, marginRight: "calc(0.5 * var(--bs-gutter-x))", backgroundImage: `url(${teamImg})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
                                </div>
                                {!teamSent && <button type="submit" className="btn btn-primary mt-2">Create</button>}
                                {teamSent && <button type="submit" className="btn btn-primary mt-2" disabled>Create</button>}
                            </form>)
                        }
                        {!user.team && (!user.scoresaber_id || !user.twitch_name) &&
                            <h3 className="alert alert-danger" role="alert">
                                You need to set your Twitch Name and ScoreSaber ID to create a team!
                            </h3>
                        }
                        {user.team &&
                            <form onChange={teamFormChanged} onSubmit={updateTeam}>
                                <div className="form-group">
                                    <label htmlFor="teamname">Team Name</label>
                                    <input type="text" className="form-control" id="teamname" placeholder="Team Name" value={teamName} onChange={onInputChange} disabled={user.id !== user.team.leader.id} />
                                </div>
                                <div className="form-group">
                                    <label>Team Color</label>
                                    <input type="color" className="form-control form-control-color p-0 border-0" style={{ backgroundColor: "transparent" }} id="teamColorHex" value={TeamColorHex()} onChange={onInputChange} disabled={user.id !== user.team.leader.id} />
                                </div>
                                <div className="row">
                                    <div className="form-group flex-grow-1 " style={{ width: "auto" }}>
                                        <label htmlFor="teamImg">Team Image</label>
                                        <input type="text" className="form-control" id="teamImg" value={teamImg} onChange={onInputChange} disabled={user.id !== user.team.leader.id} />
                                    </div>
                                    <div style={{ width: 128, height: 128, padding: 0, marginRight: "calc(0.5 * var(--bs-gutter-x))", backgroundImage: `url(${teamImg})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
                                </div>
                                {!teamSent && <button type="submit" className="btn btn-primary mt-2">Save</button>}
                                {teamSent && user.id === user.team.leader.id && <button type="submit" className="btn btn-primary mt-2" disabled>Saved</button>}
                            </form>}
                    </div>
                    {team &&
                        <div className="col-3">
                            <h1>Team Members</h1>
                            {team.users && team.users.map((member, index) => {
                                return (
                                    <div key={index} className="card rounded" style={{ marginRight: 14, marginBottom: 14 }}>
                                        <div className="row g-0">
                                            <div className="col-sm-3">
                                                <img src={`https://cdn.discordapp.com/avatars/${member.discord_id}/${member.avatar_id}.webp`} alt="User image" className="img-fluid rounded-start" />
                                            </div>
                                            <div className="col-sm-9">
                                                <h5>{member.username}</h5>
                                                <p className="card-text mb-1">Twitch: {member.twitch_name}</p>
                                                <p className="card-text mb-1">ScoreSaber: {member.scoresaber_id}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <form onChange={inviteFormChanged} onSubmit={sendInvite}>
                                <div className="form-group">
                                    <label htmlFor="inviteCode">Invite ScoreSaber Id</label>
                                    <input type="text" className="form-control" id="inviteCode" placeholder={(user.id !== user.team.leader.id ? "Only team leader can invite." : "Invite ScoreSaber Id")} value={invite} onChange={onInputChange} disabled={user.id !== user.team.leader.id} />
                                </div>
                                {!inviteSent && <button type="submit" className="btn btn-primary mt-2">Invite</button>}
                                {inviteSent && user.id === user.team.leader.id && <button type="submit" className="btn btn-primary mt-2" disabled>Invited</button>}
                            </form>
                        </div>
                    }
                </div>
            </section>
        </>
    );
}
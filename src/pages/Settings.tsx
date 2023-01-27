import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Auth";
import BackgroundContainer from "../components/Background";
import { useRequest } from "../components/Request";
import { useTitle } from "../components/Title";

export default function Settings() {
    const [twitchName, setTwitchName] = useState("");
    const [scoresaberId, setScoresaberId] = useState("");
    const { user, login } = useAuth();
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;
    const [sent, setSent] = useState(false);

    useEffect(() => {
        setTitle("Settings");
    }, [setTitle]);

    useEffect(() => {
        if (user) {
            setTwitchName(user.twitch_name);
            setScoresaberId(user.scoresaber_id);
        }
    }, [user]);

    function copyDiscordId() {
        navigator.clipboard.writeText(user.discord_id);
    }

    async function saveSettings(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        const formElements = form.currentTarget.elements as any;
        const twitchName = formElements.twitchName.value;
        const scoresaberId = formElements.scoresaberId.value;
        await getUrl("/authorized/user/update", { method: "POST", body: JSON.stringify({ twitch_name: twitchName, scoresaber_id: scoresaberId }), headers: { "Content-Type": "application/json" } });
        login();
        setSent(true);
    }

    function onInputChange(input: React.ChangeEvent<HTMLInputElement>) {
        const name = input.currentTarget.id;
        let value = input.currentTarget.value;
        if (name === "twitchName") {
            setTwitchName(value);
        } else if (name === "scoresaberId") {
            if (/http/.test(value)) {
                value = value.substring(value.lastIndexOf("/") + 1);
            }
            setScoresaberId(value);
        }
    }

    function formChanged() {
        setSent(false);
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
                <div className="container-fluid transition theme-color">
                    <div className="col-3">
                        <h1>User Settings</h1>
                        <form onSubmit={saveSettings} onChange={formChanged}>
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
                </div>
            </section>
        </>
    );
}
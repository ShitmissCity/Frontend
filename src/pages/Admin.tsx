import React, { useEffect, useState } from "react";
import BackgroundContainer from "../components/Background";
import Transition from "../components/Transition";
import Qualifier from "../components/admin/Qualifier";
import MapPool from "../components/admin/MapPool";
import { useTitle } from "../components/Title";
import { Permission } from "../entity/User";
import { useAuth } from "../components/Auth";
import { useRequest } from "../components/Request";
import { useToast } from "../components/Toast";

type res = (value: Response) => void;

export default function Admin() {
    const { setTitle } = useTitle();
    const [tab, setTab] = useState(0);
    const [fade, setFade] = useState(true);
    const [bracketId, setBracketId] = useState<string>("");
    const { user } = useAuth();
    const { getUrl } = useRequest();
    const { showToast } = useToast();
    const timeout = 500;
    const pages = [
        { name: "Qualifier", component: <Qualifier />, permission: Permission.Admin },
        { name: "Map Pools", component: <MapPool />, permission: Permission.MapPooler }
    ]

    useEffect(() => {
        setTitle("Admin Panel");
        getUrl("/public/bracket/id").then(res => {
            return new Promise((resolve: res, reject: res) => {
                if (res.ok) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        }).then(res => res.text()).then(setBracketId).catch(() => console.log("Error while fetching bracket id"));
    }, [setTitle]);

    useEffect(() => {
        setFade(false);
        setTimeout(() => {
            setFade(true);
        }, timeout);
    }, [tab]);

    function updateBracketId(e: React.FocusEvent<HTMLInputElement>) {
        e.preventDefault();
        getUrl(`/authorized/bracket/id/${bracketId}`, { method: "PUT" }).then(res => {
            new Promise((resolve: (value: Promise<string>) => void, reject) => {
                if (res.ok) {
                    resolve(res.text());
                }
                else {
                    reject(res);
                }
            }).then((id) => {
                setBracketId(id);
                showToast("Bracket Id updated", "success")
            }).catch(() => showToast("Error while updating bracket id", "error"));
        })
    }

    function changeBracketId(e: React.ChangeEvent<HTMLInputElement>) {
        setBracketId(e.target.value);
    }

    return (
        <>
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Admin Panel
                        </h1>
                    </div>
                </div>
                <div className="hero-foot">
                    <nav className="tabs is-boxed is-fullwidth">
                        <div className="container">
                            <ul className="nav justify-content-center nav-pills nav-fill app-background rounded-top">
                                {pages.map((page, index) => Permission.isRole(user.role.permissions, page.permission) ? (
                                    <li key={index} className="nav-item rounded-top" onClick={() => { setTab(index); }}>
                                        <a className={"nav-link" + (index === tab ? " active" : "")}>{page.name}</a> {/* eslint-disable-line */}
                                    </li>
                                ) : null)}
                            </ul>
                        </div>
                    </nav>
                </div>
            </BackgroundContainer>
            <section className="section app-background">
                <div className="container-fluid transition theme-color">
                    <Transition classNames="faq-transition"
                        timeout={timeout}
                        in={fade}>
                        {pages[tab].component}
                    </Transition>
                </div>
                {Permission.isRole(user.role.permissions, Permission.Admin) && (
                    <div className="container-fluid pt-3">
                        <h2>Settings</h2>
                        <div className="d-flex">
                            <div className="form-floating col-12 col-xs-6 col-sm-4 col-md-3 col-lg-2">
                                <input type="text" className="form-control" id="bracketId" placeholder="bracketId" autoComplete="fuck-off-autofill" onBlur={updateBracketId} value={bracketId} onChange={changeBracketId} />
                                <label htmlFor="bracketId" className="form-label">Bracket Id</label>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
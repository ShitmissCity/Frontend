import React, { useEffect } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { getUrl } from "../components/Request";
import { useTitle } from "../components/Title";
import Transition from "../components/Transition";
import { User, Team } from "../entity";

export default function Staff() {
    const [loading, setLoading] = React.useState(true);
    const [staff, setStaff] = React.useState<User[]>([]);
    const [teams, setTeams] = React.useState<Team[]>([]);
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Staff");
        getUrl("/public/users/getstaff").then(res => res.json() as Promise<User[]>).then(setStaff).finally(() => setLoading(false));
        getUrl("/public/teams/staffteams").then(res => res.json() as Promise<Team[]>).then(setTeams);
    }, [setTitle]);

    return (<div>
        {loading ? <Loader /> : null}
        <BackgroundContainer size="small">
            <div className="hero-body">
                <div className="container" style={{ width: "71%" }}>
                    <h1 className="title">
                        Staff
                    </h1>
                    <h2 className="subtitle">
                        The staff team behind Shitmiss City {process.env.REACT_APP_YEAR}.
                    </h2>
                </div>
            </div>
        </BackgroundContainer>
        <section className="section app-background">
            <nav className="level theme-color" style={{ marginBottom: 50 }}>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Teams</p>
                        <p className="title theme-color">{teams.length}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Staff Memebers</p>
                        <p className="title theme-color">{staff.length}</p>
                    </div>
                </div>
            </nav>
            <h2 className="subtitle has-text-centered">Staff</h2>
            <Transition in={!loading} timeout={500} classNames="slide-transition">
                {!loading && staff.length > 0 ? <div style={{ minHeight: 100 }} className="cards is-centered columns is-multiline">
                    {staff.map((user, index) => (
                        <div key={index} className="card column is-3" style={{ marginRight: 14, marginBottom: 14 }}>
                            <div className="card-content" style={{ padding: 0 }}>
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image" style={{ width: 120 }}>
                                            <img src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_id}.webp`} alt="User image" />
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p className="title is-4">{user.username}</p>
                                        <p className="subtitle is-6">{user.role.position}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : <div></div>}
            </Transition>
            <br />
            <h2 className="subtitle has-text-centered">Teams</h2>
            <Transition in={!loading} timeout={500} classNames="slide-transition">
                {!loading && staff.length > 0 ? <div style={{ minHeight: 100 }} className="cards is-centered columns is-multiline">
                    {teams.map((team, index) => (
                        <div key={index} className="card column is-3" style={{ marginRight: 14, marginBottom: 14 }}>
                            <div className="card-content" style={{ padding: 0 }}>
                                <div className="media">
                                    <div className="media-left" style={{ backgroundColor: team.color, width: 130 }}>
                                        <figure className="image" style={{ width: 120 }}>
                                            <img src={team.avatar_url} alt="Team image" />
                                        </figure>
                                    </div>
                                    <div>
                                    </div>
                                    <div className="media-content">
                                        <p className="title is-4">{team.name}</p>
                                        <p className="subtitle is-6" style={{ margin: 0 }}>Users</p>
                                        <p className="subtitle is-6">{team.members.map(t => t.username).join(", ")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : <div></div>}
            </Transition>
        </section>
        {/*<div v-for="team in teams.filter(team => team.membersInTeam.length > 0)" :key="team.name" class="container" style="margin-bottom: 35px">
            <h1 class="title apply-font" style="margin-bottom: 2rem; display: table">
              <svg style="width: 23px; margin-right: 10px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle :fill="'rgb(' + Math.floor(team.guildRole.color / (256*256)) + ', ' + Math.floor(team.guildRole.color / 256) % 256 + ', ' + team.guildRole.color % 256 + ')'" cx="50" cy="50" r="50"/></svg> <span class="theme-color" style="margin-right: 10px;">{{ team.name }}</span> <span style="font-size: 24px; color: #9d9d9d; display: table-cell; vertical-align: middle;">— {{ team.membersInTeam.length }}</span>
            </h1>

            <div class="cards is-centered columns is-multiline" style="min-height: 100px;">
              <div v-for="member in team.membersInTeam" :key="member.id" class="card column is-3" style="margin: 5px;">
                <div class="card-content">
                  <div class="media">
                    <div v-if="member.status" class="media-left b-tooltips">
                      <b-tooltip :label="(member.status) ? (member.status.game) ? 'Playing ' + member.status.game : (member.status.code === 'dnd') ? 'Do Not Disturb' : (member.status.code === 'idle') ? 'Idle' : (member.status.code === 'online') ? 'Online' : '' : ''" position="is-bottom"  type="is-dark">
                        <figure class="image" style="width: 80px;">
                          <img :src="member.avatar" :alt="member.user.username + '\'s Discord Avatar'" style="border-radius: 15px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)">
                          <svg style="width: 23px; margin-right: 10px; position: absolute; margin-top: -18px; margin-left: 64px;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle :fill="(member.status.code === 'dnd') ? '#f04747' : (member.status.code === 'idle') ? '#faa61a' : (member.status.code === 'online') ? '#43b581' : '#888'" cx="50" cy="50" r="50"/></svg>
                        </figure>
                      </b-tooltip>
                    </div>
                    <div v-else class="media-left b-tooltips">
                      <figure class="image" style="width: 80px;">
                        <img :src="member.avatar" :alt="member.user.username + '\'s Discord Avatar'" style="border-radius: 15px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title" style="font-size: 2vh; word-wrap: initial"><a :href="'https://discordapp.com/users/' + member.user.id" target="_blank"><span class="theme-color">{{ member.nickname }}</span></a></p>
                      <p class="subtitle is-6" style="font-size: 14px;"><i style="color: #7289DA" class="fab fa-discord"></i> <span style="color: #888; font-size: 16px;">{{ member.user.username }}#{{ member.user.discriminator }}</span>
                        <span style="margin-top: 10px; display: block">
                      <b-tag v-for="role in member.discordRoles" :key="role.id" :style="[ { 'background-color': 'rgb(' + Math.floor(role.color / (256*256)) + ', ' + Math.floor(role.color / 256) % 256 + ', ' + role.color % 256 + ')'  }, { 'margin': '1px' } ]" is-rounded>
                        <span :style="{ 'color': 'rgb(' + invertColor({ r: Math.floor(role.color / (256*256)), g: Math.floor(role.color / 256) % 256, b: role.color % 256 }).r + ', ' + invertColor({ r: Math.floor(role.color / (256*256)), g: Math.floor(role.color / 256) % 256, b: role.color % 256 }).g + ', ' + invertColor({ r: Math.floor(role.color / (256*256)), g: Math.floor(role.color / 256) % 256, b: role.color % 256 }).b + ')' }">
                          {{ role.name }}
                        </span>
                      </b-tag>
                    </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>*/}
    </div>);
}
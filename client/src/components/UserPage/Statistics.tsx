import { useAppSelector } from '../../hooks'
import './statistics.css'

function Statistics() {
    const sessionUser = useAppSelector((state) => state.session.user);

    return (
        <div id="statistics-main">
            <div className='statistics-info-section'>
                <div>
                    <h2>{(sessionUser as any)?.completedLeetcodeProblems.split(",").length - 1}</h2>
                    <p>Problems Solved</p>
                </div>
                <div>
                    <h2>120</h2>
                    <p>Hours Spent</p>
                </div>
                <div>
                    <h2>203</h2>
                    <p>Times Paired Up</p>
                </div>
            </div>

            <h3>DSA Leaderboard:</h3>
            <div id="leaderboard-container">
                <div className='leaderboard-heading-entry'>
                    <div></div>
                    <div>User</div>
                    <div>Problems Solved</div>
                    <div>Times Paired</div>
                </div>

                <div className='leaderboard-entry'>
                    <div>1</div>
                    <div>Jaded</div>
                    <div>70</div>
                    <div>450</div>
                </div>

                <div className='leaderboard-entry'>
                    <div>3</div>
                    <div>Meli Matrix</div>
                    <div>54</div>
                    <div>260</div>
                </div>

                <div className='leaderboard-entry'>
                    <div>2</div>
                    <div>Code Jelly</div>
                    <div>67</div>
                    <div>310</div>
                </div>

                <div className='leaderboard-entry'>
                    <div>4</div>
                    <div>Xaiss</div>
                    <div>40</div>
                    <div>210</div>
                </div>

                <div className='leaderboard-entry'>
                    <div>5</div>
                    <div>Tilla_Tortilla</div>
                    <div>36</div>
                    <div>190</div>
                </div>

            </div>
        </div>
    )

}


export default Statistics

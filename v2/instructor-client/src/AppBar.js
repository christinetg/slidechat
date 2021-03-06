import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClickAwayListener } from '@material-ui/core';

import { baseURL, instructorURL } from './config';

/**
 * App bar: consisting the logo and some menu buttons
 */
function AppBar(props) {
	const [userDropDown, setUserDropDown] = useState('');

	return (
		<div className='appbar'>
			<a href={`${baseURL}/`} className='logo-link'>
				<img className='appbar-logo' src={`${baseURL}/imgs/logo.png`} alt='SlideChat' />
			</a>
			<div>
				<Link to={`${baseURL}${instructorURL}`} className='appbar-item'>
					My Courses
				</Link>
				{props.user ? (
					<ClickAwayListener onClickAway={(e) => setUserDropDown('')}>
						<span className='dropdown' onClick={(e) => setUserDropDown('open')}>
							<span className='appbar-item'>Hi, {props.user} !</span>
							<div className={`dropdown-content ${userDropDown}`}>
								<Link className='dropdown-item' to={`${baseURL}/logout`}>
									Logout
								</Link>
							</div>
						</span>
					</ClickAwayListener>
				) : null}
			</div>
		</div>
	);
}

export default AppBar;

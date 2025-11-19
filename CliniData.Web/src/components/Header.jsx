import React from 'react';
import './Header.css';


export default function Header({children}){
return (
<header className="cd-header">
<div className="cd-container">
<div className="cd-left">
<img src="/src/assets/logo.png" alt="CliniData" className="cd-logo" />
<h3>CliniData</h3>
</div>
<nav className="cd-right">
{children}
</nav>
</div>
</header>
);
}
import React from 'react';
import './TopMenuInstituicao.css';
import { NavLink } from 'react-router-dom';


export default function TopMenuInstituicao(){
return (
<div className="topmenu card">
<NavLink to="/instituicao/dashboard" className={({isActive})=> isActive? 'tab active':'tab'}>Dashboard</NavLink>
<NavLink to="/instituicao/medicos" className={({isActive})=> isActive? 'tab active':'tab'}>Médicos</NavLink>
<NavLink to="/instituicao/pacientes" className={({isActive})=> isActive? 'tab active':'tab'}>Pacientes</NavLink>
<NavLink to="/instituicao/equipamentos" className={({isActive})=> isActive? 'tab active':'tab'}>Equipamentos</NavLink>
<NavLink to="/instituicao/financeiro" className={({isActive})=> isActive? 'tab active':'tab'}>Financeiro</NavLink>
</div>
);
}
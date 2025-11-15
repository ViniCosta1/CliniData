import React from 'react';
import Header from '../components/Header';
import TopMenuInstituicao from '../components/TopMenuInstituicao';
import '../../index.css';


export default function InstituicaoLayout({children}){
return (
<div>
<Header>
{/* poderia adicionar botões de usuário/logout aqui */}
</Header>


<div style={{background:'#f8fafc',padding:'14px 0'}}>
<div className="container">
<TopMenuInstituicao />
</div>
</div>


<main className="container" style={{paddingTop:24}}>
{children}
</main>
</div>
);
}
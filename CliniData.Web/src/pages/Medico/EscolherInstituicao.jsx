import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../../components/Header';


export default function EscolherInstituicao(){
const [instituicoes,setInstituicoes] = useState([]);
const navigate = useNavigate();


useEffect(()=>{
// TODO: puxar da API
setInstituicoes([
{id:1,nome:'Hospital Central'},
{id:2,nome:'Clinica Santa Maria'}
]);
},[]);


function abrir(id){
// salvar instituição selecionada e ir pro prontuário
localStorage.setItem('instituicaoId', id);
navigate('/medico/prontuario');
}


return (
<div>
<Header />
<div className="container" style={{paddingTop:24}}>
<h2>Escolha a instituição</h2>
<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginTop:12}}>
{instituicoes.map(i=> (
<div key={i.id} className="card">
<h3>{i.nome}</h3>
<button className="btn-primary" onClick={()=>abrir(i.id)}>Entrar</button>
</div>
))}
</div>
</div>
</div>
);
}
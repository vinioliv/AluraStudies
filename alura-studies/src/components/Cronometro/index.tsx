import Botao from "../Botao";
import Relogio from "./Relogio";
import style from './Cronometro.module.css'
import { tempoParaSegundos } from "../common/utils/time";
import { ITarefa } from "../../types/tarefa";
import { useEffect, useState } from "react";

import alarm from "../../../src/assets/sounds/stop.mp3"

import useSound from 'use-sound';



interface Props{
    selecionado:  ITarefa | undefined,
    finalizarTarefa: () => void
}

export function Cronometro({selecionado, finalizarTarefa}:Props){
    const[tempo, setTempo] = useState<number>();
    const[cronometroRodando, setCronometroRodando] = useState<boolean>(false);
   

    const [playSound] = useSound(alarm);

    


    useEffect(()=>{
        if(selecionado?.tempo){
            setTempo(tempoParaSegundos(selecionado.tempo))
        }
    },[selecionado]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
    
        if (cronometroRodando) {
          const runTimer = () => {
            timeoutId = setTimeout(() => {
              setTempo((prevTempo) => {
                if (prevTempo === 0) {
                  setCronometroRodando(false); 
                  finalizarTarefa();
                  playSound();
                } else if(prevTempo !== undefined){
                  return prevTempo - 1;
                }
              });
              runTimer();
            }, 1000);
          };
    
          runTimer();
        }
    
        return () => clearTimeout(timeoutId);
      }, [cronometroRodando]);
   
    function iniciarOuRetomarCronometro(){
        setCronometroRodando(true)
    }

    function pausarCronometro(){
        setCronometroRodando(false)
    }



    return (
        <div className={style.cronometro}> 
            <p className={style.titulo}>Escolha um card e inicie o cronômetro</p>
            <div className={style.relogioWrapper}>
            <Relogio tempo={tempo}/>
            </div>
            <Botao onClick={ () => cronometroRodando ? pausarCronometro() : iniciarOuRetomarCronometro()} type="submit">
                {cronometroRodando ? `Pausar` : `Começar`}          
            </Botao>
           
        </div>
    )
}
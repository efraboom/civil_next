import { useState } from 'react';
import { Formik,Form, Field } from 'formik'
import * as Yup from 'yup';
import Error from '../components/Error';
import Layout from '../components/Layout';


const Losas = () => {
    
    //Cargando
    const [cargando, setCargando] = useState(false);
    const [reporte, setReporte] = useState({});
    //SUbmit todo el proceso
    
    const handelSubmit = (valores) =>{
        const { luz1, luz2, luz3, fy, fc, carga_m, carga_v, base_losa, ancho_viga } = valores;
        let alfa= 0.90
        //Determinando la dirección
        if (luz1 < luz2){
            console.log('es una Losa en una dirección')
        }
        else{
            console.log('es una Losa en dos direcciones \n')
        }

        let extremo1= ((luz1 - ancho_viga)/24)
        console.log(`peralte 1: ${extremo1} metros \n`)
        let extremo2= ((luz2 - ancho_viga)/28)
        console.log(`peralte 2: ${extremo2} metros \n`)
        let extremo3= ((luz3 - ancho_viga)/24)
        console.log(`peralte 3: ${extremo3} metros \n`)

        //Tomando el peralte mayor
        let peralte_bruto = 0

        if(extremo1 < extremo2){
            peralte_bruto = extremo2.toFixed(1)
        }
        else{
            peralte_bruto = extremo1.toFixed(1)
        }

        console.log(`peralte final(hf): ${peralte_bruto} metros \n`)
        let p_aux= 0.03
        let peralte_efectivo= (peralte_bruto-p_aux).toFixed(2)
        console.log(`peralte efectivo(he): ${peralte_efectivo} metros \n`)

        //Combinación de cargas
        let Wu= (1.4*carga_m + 1.7*carga_v).toFixed(2)
        console.log(`carga ultima: ${Wu} Kn/m \n`)
        //Analisis usando el metodo de los coeficientes (Momentos)
        //Coeficientes para momentos negativos
        let coeficiente1 = (1/24)
        let coeficiente2 = (1/10)
        let coeficiente3 = (1/10)
        let coeficiente4 = (1/24)
        //Coeficientes para momentos positivos
        let coeficiente5 = (1/11)
        let coeficiente6 = (1/16)
        let coeficiente7 = (1/11)

        //calculo de Momentos
        console.log("MOMENTOS MEGATIVOS")
        let Momento1= (coeficiente1*Wu*(luz1*luz1)).toFixed(2)
        console.log(`Momento 1: ${Momento1} Kn/m \n`)
        let Momento2= (coeficiente2*Wu*(luz2*luz2)).toFixed(2)
        console.log(`Momento 2: ${Momento2} Kn/m \n`)
        let Momento3= (coeficiente3*Wu*(luz2*luz2)).toFixed(2)
        console.log(`Momento 3: ${Momento3} Kn/m \n`)
        let Momento4= (coeficiente4*Wu*(luz3*luz3)).toFixed(2)
        console.log(`Momento 4: ${Momento4} Kn/m \n`)

        console.log("MOMENTOS POSITIVOS")
        let Momento5= (coeficiente5*Wu*(luz1*luz1)).toFixed(2)
        console.log(`Momento 5: ${Momento5} Kn/m \n`)
        let Momento6= (coeficiente6*Wu*(luz2*luz2)).toFixed(2)
        console.log(`Momento 6: ${Momento6} Kn/m \n`)
        let Momento7= (coeficiente7*Wu*(luz3*luz3)).toFixed(2)
        console.log(`Momento 7: ${Momento7} Kn/m \n`)


        console.log("AREAS DE REFUERZOS NEGATIVAS")
        let As_p1=Math.round((alfa)*(fy*10)*(peralte_efectivo*100))
        //console.log('parte 1: {}cm^2 \n'.format(As_p1))
        let As_p2=Math.round((Math.pow((As_p1),2)),0)
        //console.log('parte 2: {} cm^2 \n'.format(As_p2))
        let As_p3=Math.round((4*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))*(Momento1*10000))
        //console.log('parte 3: {} cm^2\n'.format(As_p3))
        let As_p4=Math.round(2*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))
        //console.log('parte 4: {} cm^2 \n'.format(As_p4))
        let As_1= ((As_p1 - Math.sqrt(As_p2-As_p3))/As_p4).toFixed(2)
        console.log(`Area de refuerzo 1: ${As_1} cm^2 \n`)
         
        let As2_p1=Math.round(((alfa)*(fy*10)*(peralte_efectivo*100)))
        //console.log('parte 1: {}cm^2 \n'.format(As2_p1))
        let As2_p2=Math.round((Math.pow((As2_p1),2)))
        //console.log('parte 2: {} cm^2 \n'.format(As2_p2))
        let As2_p3=Math.round((4*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))*(Momento2*10000))
        //console.log('parte 3: {} cm^2\n'.format(As2_p3))
        let As2_p4=Math.round(2*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))
        //console.log('parte 4: {} cm^2 \n'.format(As2_p4))
        let As_2= ((As2_p1 - Math.sqrt(As2_p2-As2_p3))/As2_p4).toFixed(2)
        console.log(`Area de refuerzo 2: ${As_2} cm^2 \n`)

        console.log("AREAS DE REFUERZOS POSITIVOS")
        let As3_p1=Math.round((alfa)*(fy*10)*(peralte_efectivo*100))
        //console.log('parte 1: {}cm^2 \n'.format(As3_p1))
        let As3_p2=Math.round(Math.pow((As3_p1),2))
        //console.log('parte 2: {} cm^2 \n'.format(As3_p2))
        let As3_p3=Math.round((4*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))*(Momento5*10000))
        //console.log('parte 3: {} cm^2\n'.format(As3_p3))
        let As3_p4=Math.round(2*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))
        //console.log('parte 4: {} cm^2 \n'.format(As3_p4))
        let As_3= ((As3_p1 - Math.sqrt(As3_p2-As3_p3))/As3_p4).toFixed(2)
        console.log(`Area de refuerzo 3: ${As_3} cm^2 \n`)
        
        let As4_p1=Math.round((alfa)*(fy*10)*(peralte_efectivo*100))
        //console.log('parte 1: {}cm^2 \n'.format(As4_p1))
        let As4_p2=Math.round(Math.pow((As4_p1),2))
        //console.log('parte 2: {} cm^2 \n'.format(As4_p2))
        let As4_p3=Math.round((4*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))*(Momento6*10000))
        //console.log('parte 3: {} cm^2\n'.format(As4_p3))
        let As4_p4=Math.round(2*((alfa*Math.pow((fy*10),2))/(1.7*(fc*10)*(base_losa*100))))
        //console.log('parte 4: {} cm^2 \n'.format(As4_p4))
        let As_4= Math.round((As4_p1 - Math.sqrt(As4_p2-As4_p3))/As4_p4)
        console.log(`Area de refuerzo 4: ${As_4} cm^2 \n`)

        //CUANTIA TOMADA DE LA NORMA
        let pt = 0
        
        //calculo de acero minimo
        if (fy >= 420){
            pt = 0.0018
        }
        else{
            pt = 0.0020
        }
             
        let AS_Min = (pt*(base_losa*100)*(peralte_bruto*100)).toFixed(2)
        console.log(`acero Minimo : ${AS_Min} cm^2 \n`)

        let AS_final_1 = 0
        if (AS_Min < As_1){
            AS_final_1 = As_1
        }
        else{
            AS_final_1 = AS_Min
        }
        console.log(`acero final negativo 1 : ${AS_final_1} cm^2 \n`)
        
        let AS_final_2 = 0
        if (AS_Min < As_2){
            AS_final_2 = As_2
        }
        else{
            AS_final_2 = AS_Min
        }
        console.log(`acero final negativo 2 : ${AS_final_2} cm^2 \n`)
        
        let AS_final_3 = 0
        if (AS_Min < As_3){
            AS_final_3 = As_3
        }
        else{
            AS_final_3 = AS_Min
        }
        console.log(`acero final positivo 1 : ${AS_final_3} cm^2 \n`)
        
        let AS_final_4 = 0
        if (AS_Min < As_4){
            AS_final_4 = As_4
        }
        else{
            AS_final_4 = AS_Min
        }
        console.log(`acero final positivo 2 : ${AS_final_4} cm^2 \n`)

        //console.log('selecione un DIAMETRO de varillas  \n')
        let varillaNo3 = 0.95
        let varillaNo4 = 1.27
        let varillaNo5 = 1.59
        let varillaNo6 = 1.91
        let varillaNo8 = 2.54
        let varillaNo10 = 3.18
        let varillaNo12 = 3.81

        let av_tomada_1 = 0
        //para los apoyos A Y D
        console.log('PARA LOS APOYOS A y D \n')
        if (AS_final_1 > varillaNo3){
            av_tomada_1 = varillaNo3
        }
        else{
            av_tomada_1 = varillaNo4
        }
        console.log(`area varilla tomada 1 : ${av_tomada_1} cm^2 \n`)
        let separacion1 =(av_tomada_1 / (AS_final_1 / 1)).toFixed(3)
        console.log(`separacion 1 : ${separacion1} m \n'`)
        console.log("Usar la varilla tomada a la separacion calculada \n")

        let av_tomada_2 = 0
        //para los apoyos B Y C
        console.log('PARA LOS APOYOS B y C \n')
        if (AS_final_2 > varillaNo3){
            av_tomada_2 = varillaNo4
        }
        else{
            av_tomada_2 = varillaNo3
        }
        console.log(`area varilla tomada 2 : ${av_tomada_2} cm^2 \n`)
        let separacion2 = ( av_tomada_2 / (AS_final_2 / 1)).toFixed(3)
        console.log(`separacion 2 : ${separacion2} m \n`)
        console.log("Usar la varilla tomada a la separacion calculada \n")


        let av_tomada_3 = 0
        //para los TRAMOS AB Y CD
        console.log('PARA LOS TRAMOS AB y CD \n')
        if (AS_final_3 > varillaNo3){
            av_tomada_3 = varillaNo4
        }
        else{
            av_tomada_3 = varillaNo3
        }
        console.log(`varilla tomada 3 : ${av_tomada_3} cm^2 \n`)
        let separacion3 = ( av_tomada_3 / (AS_final_3 / 1)).toFixed(3)
        console.log(`separacion 3 : ${separacion3} m \n`)
        console.log("Usar la varilla tomada a la separacion calculada \n")

        let av_tomada_4 = 0
        //para EL TRAMOS BC
        console.log('PARA EL TRAMO BC \n')
        if (AS_final_4 > varillaNo3){
            av_tomada_4 = varillaNo4
        }
        else{
            av_tomada_4 = varillaNo3
        }
        console.log(`varilla tomada 4 : ${av_tomada_4} cm^2 \n`)
        let separacion4 = ( av_tomada_4 / (AS_final_4 / 1)).toFixed(4)
        console.log(`separacion 4 : ${separacion4} m \n`)
        console.log("Usar la varilla tomada a la separacion calculada \n")
        
        //acero por temperatura
        let As_temp= (AS_Min/2).toFixed(2)
        console.log(`acero por temperatura : ${As_temp} cm^2 \n`)
        
        console.log('ÉSTO DEBE SER VERIFICADO CON LA LONGITUD DE DESARROLLO \n \n')
        



        setReporte({
            luz1,
            luz2,
            extremo1,
            extremo2,
            extremo3,
            peralte_bruto,
            peralte_efectivo,
            Wu,
            Momento1,
            Momento2,
            Momento3,
            Momento4,
            Momento5,
            Momento6,
            Momento7,
            As_1,
            As_2,
            As_3,
            As_4,
            AS_Min,
            AS_final_1,
            AS_final_2,
            AS_final_3,
            AS_final_4,
            av_tomada_1,
            separacion1,
            av_tomada_2,
            separacion2,
            av_tomada_3,
            separacion3,
            av_tomada_4,
            separacion4,
            As_temp
            
        })
        setCargando(true)

       
    }


    const vigasSchema = Yup.object().shape({
        luz1: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        luz2: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        luz3: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fy: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fc: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        carga_m: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        carga_v: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        base_losa: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        ancho_viga: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo')
    })


    //Validando el formulario
    return (
        <Layout
            page='Losas'
        >
            <div >
                <h2
                    className=' text-center text-gray-900 text-4xl font-bold mt-3 font-mono'
                    >LEA BIEN ANTES DE USAR EL PROGRAMA 
                </h2>
                <p className=" text-center font-mono font-bold text-gray-900 text-lg">
                    ESTE PROGRAMA TRABAJA PARA CARGAS DISTRIBUIDA
                </p>
                <p className="text-center font-mono font-bold text-gray-900 text-lg mb-3">
                    ESTA MAYORADO CON LA PERUANA
                </p>

                <Formik
                    initialValues={{
                        luz1: 0,
                        luz2: 0,
                        luz3: 0,
                        fy: 0,
                        fc: 0,
                        carga_m: 0,
                        carga_v: 0,
                        base_losa: 0,
                        ancho_viga: 0
                    }}

                    onSubmit = {(values) => {
                        handelSubmit(values)                    
                    }}

                    validationSchema={vigasSchema}
                >
                    {({ errors, touched }) =>{

                        return(
                            <Form
                                className=' grid md:grid-cols-2 content-center gap-10'
                            >
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='luz1' 
                                        className=' block font-mono text-gray-900'
                                    >luz libre1 (Metros) </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='luz1'
                                        name='luz1'
                                    />
                                    {errors.luz1&& touched.luz1 ? (
                                        <Error>
                                            {errors.luz1}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='luz2' 
                                        className=' block font-mono text-gray-900'
                                    >luz libre2 (Metros) </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='luz2'
                                        name='luz2'
                                    />
                                    {errors.luz2 && touched.luz2 ? (
                                        <Error>
                                            {errors.luz2}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='luz3' 
                                        className=' block font-mono text-gray-900'
                                    >luz libre3 (Metros) </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='luz3'
                                        name='luz3'
                                    />
                                    {errors.luz3 && touched.luz3 ? (
                                        <Error>
                                            {errors.luz3}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='fy'
                                        className=' block font-mono text-gray-900'
                                    >Fy (mpa): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='fy'
                                        name='fy'
                                    />
                                    {errors.fy && touched.fy ? (
                                        <Error>
                                            {errors.fy}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='fc'
                                        className=' block font-mono text-gray-900'
                                    >fc (mpa): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='fc'
                                        name='fc'
                                    />
                                    {errors.fc && touched.fc ? (
                                        <Error>
                                            {errors.fc}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='carga_m'
                                        className=' block font-mono text-gray-900'
                                    >Carga muerta (KN/m): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='carga_m'
                                        name='carga_m'
                                    />
                                    {errors.carga_m && touched.carga_m ? (
                                        <Error>
                                            {errors.carga_m}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='carga_v'
                                        className=' block font-mono text-gray-900'
                                    >Carga viva (KN/m) </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='carga_v'
                                        name='carga_v'
                                    />
                                    {errors.carga_v && touched.carga_v ? (
                                        <Error>
                                            {errors.carga_v}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='base_losa'
                                        className=' block font-mono text-gray-900'
                                    >Base de la losa (metros):  </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='base_losa'
                                        name='base_losa'
                                    />
                                    {errors.base_losa && touched.base_losa ? (
                                        <Error>
                                            {errors.base_losa}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='ancho_viga'
                                        className=' block font-mono text-gray-900'
                                    >Ancho de la viga (metros):  </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='ancho_viga'
                                        name='ancho_viga'
                                    />
                                    {errors.ancho_viga && touched.ancho_viga ? (
                                        <Error>
                                            {errors.ancho_viga}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div 
                                className=' flex flex-col content-center mb-1 mt-1 mx-8 w-f'>
                                    <input 
                                        type="submit" 
                                        value="Diseñar" 
                                        className='mx-5 mb-6 cursor-pointer mt-5, bg-blue-600 p-3 text-center text-white font-bold text-lg rounded-lg '
                                    />
                                </div>           
                            </Form>
                    )}}
                </Formik>    

                { cargando &&  (
                        <div 
                        className=' bg-slate-300 max-w-full mx-8 mt-2 mb-2 p-4 rounded-lg'
                    >
                        <h2 className="text-gray-800 font-mono font-bold text-4xl">Resumen</h2>
                        
                        
                        {luz1 < luz2 ?
                        <p className="font-mono font-bold text-gray-900 text-lg">es una Losa en una dirección</p>
                        :
                        <p className="font-mono font-bold text-gray-900 text-lg">es una Losa en dos direcciones</p>
                    }
                        
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">peralte 1: <span className=' text-red-700 font-normal'>{reporte.extremo1} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">peralte 2: <span className=' text-red-700 font-normal'>{reporte.extremo2} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">peralte 3: <span className=' text-red-700 font-normal'>{reporte.extremo3} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">peralte final(hf): <span className=' text-red-700 font-normal'>{reporte.peralte_bruto} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">peralte final(he): <span className=' text-red-700 font-normal'>{reporte.peralte_efectivo} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">carga ultima: <span className=' text-red-700 font-normal'>{reporte.Wu} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">MOMENTOS MEGATIVOS</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 1: <span className=' text-red-700 font-normal'>{reporte.Momento1} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 2: <span className=' text-red-700 font-normal'>{reporte.Momento2} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 3: <span className=' text-red-700 font-normal'>{reporte.Momento3} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 4: <span className=' text-red-700 font-normal'>{reporte.Momento4} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">MOMENTOS POSITIVOS</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 5: <span className=' text-red-700 font-normal'>{reporte.Momento5} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 6: <span className=' text-red-700 font-normal'>{reporte.Momento6} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento 7: <span className=' text-red-700 font-normal'>{reporte.Momento7} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">AREAS DE REFUERZOS NEGATIVAS</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de refuerzo 1: <span className=' text-red-700 font-normal'>{reporte.As_1} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de refuerzo 2: <span className=' text-red-700 font-normal'>{reporte.As_2} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de refuerzo 3: <span className=' text-red-700 font-normal'>{reporte.As_3} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de refuerzo 4: <span className=' text-red-700 font-normal'>{reporte.As_4} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero Minimo : <span className=' text-red-700 font-normal'>{reporte.AS_Min} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero final negativo 1 : <span className=' text-red-700 font-normal'>{reporte.AS_final_1} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero final negativo 2 : <span className=' text-red-700 font-normal'>{reporte.AS_final_2} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero final positivo 1 : <span className=' text-red-700 font-normal'>{reporte.AS_final_3} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero final positivo 2 : <span className=' text-red-700 font-normal'>{reporte.AS_final_4} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">PARA LOS APOYOS A y D</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">area varilla tomada 1 : <span className=' text-red-700 font-normal'>{reporte.av_tomada_1} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">separacion 1 : <span className=' text-red-700 font-normal'>{reporte.separacion1} m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Usar la varilla tomada a la separacion calculada</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">PARA LOS APOYOS B y C</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">area varilla tomada 2 : <span className=' text-red-700 font-normal'>{reporte.av_tomada_2} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">separacion 2 : <span className=' text-red-700 font-normal'>{reporte.separacion2} m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">PARA LOS TRAMOS AB y CD</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">area varilla tomada 3 : <span className=' text-red-700 font-normal'>{reporte.av_tomada_3} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">separacion 3 : <span className=' text-red-700 font-normal'>{reporte.separacion3} m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Usar la varilla tomada a la separacion calculada </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">PARA EL TRAMO BC</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">area varilla tomada 4 : <span className=' text-red-700 font-normal'>{reporte.av_tomada_4} cm^2 </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">separacion 4 : <span className=' text-red-700 font-normal'>{reporte.separacion4} m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Usar la varilla tomada a la separacion calculada</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">acero por temperatura: <span className=' text-red-700 font-normal'>{reporte.As_temp} m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">ÉSTO DEBE SER VERIFICADO CON LA LONGITUD DE DESARROLLO</p>



                        
                        
                    </div>
                )}    
            </div>
        </Layout>
    )
}

export default Losas
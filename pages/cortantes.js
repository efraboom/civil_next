import { useState } from 'react';
import { Formik,Form, Field } from 'formik'
import * as Yup from 'yup';
import Error from '../components/Error';
import Layout from '../components/Layout';


const Cortantes = () => {
    
    //Cargando
    const [cargando, setCargando] = useState(false);
    const [reporte, setReporte] = useState({});
    //SUbmit todo el proceso
    
    const handelSubmit = (valores) =>{
        const { luz, fy, fc, alfa, recubrimiento, cargam, cargav, s } = valores;

        //nicializando Base final
        let h_final = 0


        //Defina Altura
        console.log('CALCULO DE ALTURA \n')
        let h1 = (luz/10).toFixed(2)
        console.log(`Altura 1: ${h1} metros \n`)

        let h2 = (luz/12).toFixed(2)
        console.log(`Altura 2: ${h2} metros \n`)

        //Tomando la altura mayor
        if(h1 < h2){
            h_final = h1
        }
        else{
            h_final = h2
        }
        console.log(`Altura final: ${h_final} metros \n`)

        //Defina Base
        console.log('CALCULO BASE: \n\n')
        let base = (h_final / 2).toFixed(2)
        console.log(`Base: ${base} metros`)

        //Calculando la carga ultima
        console.log('CALCULO CARGA ULTIMA MAYORADA \n')
        let carga_U = (1.2 * cargam + 1.6 * cargav).toFixed(2)
        console.log(`Carga U: ${carga_U} kN/m \n`)

        //Diagrama de cortante
        console.log('DIAGRAMA DE CORTANTE \n')
        let v_u = ((carga_U * luz)/2).toFixed(2)
        console.log(`Cortante ultimo: ${v_u} kN \n`)
        let h_efectiva = (h_final - recubrimiento).toFixed(2)
        console.log(`Altura Efectiva: ${h_efectiva} metros \n`)

        let v_max = ((alfa * (((Math.sqrt(fc) * base * h_efectiva)/6) + ((2/3)*(Math.sqrt(fc) * base * h_efectiva))))*1000).toFixed(1)
        console.log(`Cortante maxima: ${v_max} kN \n`)

        //Calculo de zonas sin estribos
        console.log('CALCULO DE ZONA SIN ESTRIBOS \n')
        let v_nominal = ((1/2 * (alfa * ((Math.sqrt(fc)*base*h_efectiva) / 6))) *1000).toFixed(2)
        console.log(`Cortante Nominal : ${v_nominal} kN \n`)

        let x1 = ((v_nominal * (luz / 2)) / v_u).toFixed(2)
        console.log(`Zona 1 sin estribo: ${x1} metros \n`)

        let v_nominal2 = ((alfa * ((Math.sqrt(fc)*base*h_efectiva) / 6))* 1000).toFixed(2) 
        console.log(`cortante nominal mayorado: ${v_nominal2} metros \n`)
        
        let x2 = ((v_nominal2 * (luz / 2)) / v_u).toFixed(4)
        console.log(`Zona 2: ${x2} metros \n`)

        let Separacion = (h_efectiva / 2).toFixed(3)
        let s_aux = Separacion
        console.log(`S: ${Separacion} metros \n`)
        let av_minimo1 = (((Math.sqrt(fc)/16) * ((base * Separacion) / fy)) * 1000000).toFixed(4)
        console.log(`Area de varillas minima: ${av_minimo1} mm cuadrados \n`)
        let av_minimo2 = ((0.33 * ((base * Separacion) / fy))* 1000000).toFixed(4)
        console.log(`Area de varillas minima 2: ${av_minimo2} mm cuadrados \n`)
        let av_tomada = 0

        if (av_minimo1 > av_minimo2){
            av_tomada = av_minimo1
        }
        else{
            av_tomada = av_minimo2
        }

        console.log(`Area de varillas tomada: ${av_tomada} mm cuadrados \n`)

        //Definir Area de varilla
        console.log('DEFINIENDO AREA DE VARILLAS A TRABAJAR \n')
        //console.log('selecione un area de varillas para estrivos \n')
        let av_minima_final = 0
        let varillaNo2 = 32
        let varillaNo3 = 71
        let varillaNo4 = 129

        if (parseInt(av_tomada) > 32  && parseInt(av_tomada) < 64){
            av_minima_final = varillaNo2
        }

        if (parseInt(av_tomada) > 64 && parseFloat(av_tomada) < 144){
            av_minima_final = varillaNo3
        }

        if (parseInt(av_tomada) > 144 && parseInt(av_tomada) < 258){
            av_minima_final = varillaNo4
        }

        console.log(`Av minima final: ${av_minima_final} mm^2 \n`)

        //AREA DE VARILLA DEFINITIVA CON UNA SEPARACION S
        console.log('AREA DE VARILLA DEFINITIVA CON UNA SEPARACION S \n')
        let av_definitiva = (av_minima_final * 2)/1000000
        console.log(`Av definitiva: ${av_definitiva} m^2`)

        //MAYOR CORTANTE
        console.log('MAYOR CORTANTE \n')
        let x3 = ((luz / 2) - h_efectiva )
        console.log(`x3 Truncado: ${x3} metros \n`)
        let x4 = ((v_u * x3) / (luz/2)).toFixed(2)
        console.log(`x4: ${x4} Kn \n`)
        

        //Ubicacion de estribo
        console.log('UBICACION DE ESTRIBOS \n')
        let z_sin_estribos =  ((v_nominal * (luz / 2)) / v_u).toFixed(3)
        console.log(`Zona sin estribos: ${z_sin_estribos} metros \n`)
        console.log(' MAYOR CORTANTE \n')
        let v_s = (((alfa * fy * (av_definitiva) * h_efectiva) / Separacion)*1000).toFixed(2)
        console.log(`v_s: ${v_s} kN \n`)
        let v_nominal_may1 = (parseFloat(v_nominal2) + parseFloat(v_s)).toFixed(2)
        console.log(`V_Nominal mayorado: ${v_nominal_may1} kN \n`)
        /* 
        if (v_nominal_may1 >= x4) {
            v_mensaje = 'Cumple'
        }{
            v_mensaje = 'No cumple modifique '
        } */
        let v_mensaje = ''

        let a_minima_mas_acero = 0 

        
        a_minima_mas_acero = ((v_nominal_may1 * (luz/2)) / v_u).toFixed(2)
        console.log(`Area minima: ${a_minima_mas_acero}`)
        let a_minima_mas_acero_definitiva=(a_minima_mas_acero - z_sin_estribos)
        console.log(`Area minima mas acero: ${a_minima_mas_acero_definitiva} metros \n`)
        
        let cant_estribos = (a_minima_mas_acero_definitiva / Separacion).toFixed(2)
        console.log(`Cantidad de estribos: ${cant_estribos} unidades \n`)
        let a_max = ((luz / 2)-(a_minima_mas_acero)).toFixed(2)
        console.log(`Area maxima: ${a_max} metros \n`)
        let v_cumple = ''

        let nuevo_vs = 0
        let nuevo_cnominal = 0
        if (v_nominal_may1 < x4){
            nuevo_vs = (((alfa * fy * (av_definitiva) * h_efectiva) / s)*1000).toFixed(2)
            nuevo_cnominal = (parseFloat(v_nominal2) + parseFloat(nuevo_vs)).toFixed(2)
        } 
        
        

        let cant_estribos_amax = (a_max / s).toFixed(2)
        console.log(`Cantidad de estribos area maxima: ${cant_estribos_amax} unidades \n`)
       
        //Parte dificil
        
        //Ubicacion de estribo area maxima
            

        setReporte({
          h1,
          h2,
          h_final,
          base,
          carga_U,
          v_u,
          h_efectiva,
          v_max,
          v_nominal,
          x1,
          v_nominal2,
          x2,
          Separacion,
          av_minimo1,
          av_minimo2,
          av_tomada,
          av_minima_final,
          av_definitiva,
          x3,
          x4,
          z_sin_estribos,
          v_s,
          v_nominal_may1,
          a_minima_mas_acero,
          a_minima_mas_acero_definitiva,
          cant_estribos,
          a_max,  
          nuevo_vs,
          nuevo_cnominal,
          cant_estribos_amax,
          s        

        })
        setCargando(true)

       
    }


    const vigasSchema = Yup.object().shape({
        luz: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fy: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fc: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        alfa: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        recubrimiento: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser poitivo'),
        cargam: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        cargav: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        s: Yup.number('Debe ser un número')
    })


    //Validando el formulario
    return (
        <Layout
            page='Vigas a Cortante'
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
                    ESTA MAYORADO CON LA COLOMBIANA
                </p>          
                

                <Formik
                    initialValues={{
                        luz: 0,
                        fy: 0,
                        fc: 0,
                        alfa: 0,
                        recubrimiento: 0,
                        cargam: 0,
                        cargav: 0,
                        s: 0
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
                                    <label htmlFor='Luz' 
                                        className=' block font-mono text-gray-900'
                                    >Luz (metros): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='luz'
                                        name='luz'
                                    />
                                    {errors.luz && touched.luz ? (
                                        <Error>
                                            {errors.luz}
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
                                    <label htmlFor='alfa'
                                        className=' block font-mono text-gray-900'
                                    >Alfa: </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='alfa'
                                        name='alfa'
                                    />
                                    {errors.alfa && touched.alfa ? (
                                        <Error>
                                            {errors.alfa}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='recubrimiento'
                                        className=' block font-mono text-gray-900'
                                    >Recubrimiento (metros): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='recubrimiento'
                                        name='recubrimiento'
                                    />
                                    {errors.recubrimiento && touched.recubrimiento ? (
                                        <Error>
                                            {errors.recubrimiento}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='cargam'
                                        className=' block font-mono text-gray-900'
                                    >Carga muerta (KN/m): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='cargam'
                                        name='cargam'
                                    />
                                    {errors.cargam && touched.cargam ? (
                                        <Error>
                                            {errors.cargam}
                                        </Error>
                                    ): null}
                                </div>


                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='cargav'
                                        className=' block font-mono text-gray-900'
                                    >Carga viva (Kn/m):  </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='cargav'
                                        name='cargav'
                                    />
                                    {errors.cargav && touched.cargav ? (
                                        <Error>
                                            {errors.cargav}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='s'
                                        className=' block font-mono text-gray-900'
                                    >Valor de S:  </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='s'
                                        name='s'
                                    />
                                    {errors.s && touched.s ? (
                                        <Error>
                                            {errors.s}
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
                        className='bg-slate-300 max-w-full mx-8 mt-2 mb-2 p-4 rounded-lg'
                    >
                        <h2 className="text-gray-800 font-mono font-bold text-4xl">Resumen</h2>
                        <p className="font-mono font-bold text-gray-900 text-lg">Altura 1: <span className=' text-red-700 font-normal'>{reporte.h1} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Altura 2: <span className=' text-red-700 font-normal'>{reporte.h2} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Altura final: <span className=' text-red-700 font-normal'>{reporte.h_final}</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Base: {reporte.base} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">
                            Carga U: {reporte.carga_U} kN/m 
                        </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cortante ultimo: {reporte.v_u} kN </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Altura Efectiva: {reporte.h_efectiva} metros </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cortante maxima: {reporte.v_max} kN  </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cortante Nominal : {reporte.v_nominal} kN  </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Zona 1 sin estribo: {reporte.x1} metros  </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">cortante nominal mayorado: {reporte.v_nominal2} metros  </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Zona 2: {reporte.x2} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">S: {reporte.Separacion} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area de varillas minima: {reporte.av_minimo1} mm cuadrados </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area de varillas minima 2: {reporte.av_minimo2} mm cuadrados </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area de varillas tomada: {reporte.av_tomada} mm cuadrados </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Av minima final: {reporte.av_minima_final} mm^2 </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Av definitiva: {reporte.av_definitiva} m^2</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">x3 Truncado: {reporte.x3} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">x4: {reporte.x4} Kn</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Zona sin estribos: {reporte.z_sin_estribos} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">v_s: {reporte.v_s} kN</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">cortante Nominal mayorado: {reporte.v_nominal_may1} kN</p>


                        <p className="font-mono font-bold text-gray-900 text-lg"> {reporte.v_mensaje}kN</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area minima: {reporte.a_minima_mas_acero}</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area minima mas acero: {reporte.a_minima_mas_acero_definitiva} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cantidad de estribos: {reporte.cant_estribos} unidades</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">{reporte.v_mensaje}</p>                        
                        
                        <p className="font-mono font-bold text-gray-900 text-lg uppercase">SOlo se necesita estribos en el area maxima  si no cumple la condicion: (cortante nominal mayorado) mayor o igual a (x4 )  </p>
                        <p className="font-mono font-bold text-gray-900 text-lg uppercase">El (cortante nominal mayorado) debe ser mayor o igual a (x4)  de lo contrario no cumple debes modificar la separacion (S)</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Nuevo cortante Nominal {reporte.nuevo_cnominal} con el valor s = {reporte.s} </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Nuevo cortante s: {reporte.nuevo_vs} </p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area maxima: {reporte.a_max} metros</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cantidad de estribos area maxima: {reporte.cant_estribos_amax} unidades</p>


                    
                        
                    </div>
                )}    
            </div>
        </Layout>
    )
}

export default Cortantes


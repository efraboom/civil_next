import { useState } from 'react';
import { Formik,Form, Field } from 'formik'
import * as Yup from 'yup';
import Error from '../components/Error';
import Layout from '../components/Layout';


const Escaleras = () => {
    
    //Cargando
    const [cargando, setCargando] = useState(false);
    const [reporte, setReporte] = useState({});
    //SUbmit todo el proceso
    
    const handelSubmit = (valores) =>{
        const { Luz_losa, Luz_esca, fy, fc, carga_CT1, carga_CT2, Ancho_paso, recubrimiento} = valores;

        //Prosedimiento
        console.log('CALCULOS \n')
        
        let Luz_libre = Luz_losa + Luz_esca
        console.log(`luz libre : ${Luz_libre} metros \n`)
        //definiendo el espesor
        let espesor = Luz_libre/20
        console.log(`espesor : ${espesor} metros \n`)
        
        //sumatoria de fuerza
        let s_fuerza = ((carga_CT1*Luz_esca)+(carga_CT2*Luz_losa)).toFixed(1)
        console.log(`sumatoria de fuerza y : ${s_fuerza} Kn \n`)

        //sumatoria de momento para encontrar reacciones
        let Rb_p1 = carga_CT1*Luz_esca
        let Rb_P2 = Luz_esca/2
        let Rb_p3 = (Luz_esca + (Luz_losa/2))
        let Re_b = ((Rb_p1*Rb_P2 + (carga_CT2*Luz_losa)*Rb_p3)/3).toFixed(2)

        console.log(`REACCIÓN EN (B) : ${Re_b} Kn \n`)

        let Re_a= (s_fuerza - Re_b).toFixed(2)
        console.log(`REACCIÓN EN (A) : ${Re_a} Kn \n`)

        //Cortante en X
        let Vx = (Re_a/carga_CT1).toFixed(2)
        console.log(`CORTANTE EN (X) : ${Vx} Metros \n`)

        //Momento en X
        let M_max = ((Re_a*Vx) - ((carga_CT1/2) * Math.pow((Vx),2))).toFixed(2)
        console.log(`Momento Maximo : ${M_max} Kn*m \n`)

        let d_efectiva = (espesor - recubrimiento).toFixed(3)
        console.log(`distancia efectiva (d): ${d_efectiva} metros \n`)

        //Calculo de cuantia
        let p_1 = ((900 * fc * fy * (Ancho_paso*1000) * Math.pow((d_efectiva*1000),2)))
        //console.log(p_1)
        let p_2 = ((Math.pow(900,2) * Math.pow(fc,2) * Math.pow(fy,2) * Math.pow((Ancho_paso*1000),2) * Math.pow((d_efectiva*1000),4)))
        //console.log(p_2)
        let p_3 = ((2124000 * Math.pow(fy,2) * (Ancho_paso*1000) * Math.pow((d_efectiva*1000),2) * fc * (M_max*1000000)))
        //console.log(p_3)
        let p_4 = ((1062 * Math.pow(fy,2) * (Ancho_paso*1000) * Math.pow((d_efectiva*1000),2)))
        //console.log(p_4)
        
        let p_real = ((p_1-Math.sqrt(p_2-p_3))/p_4).toFixed(5)
        console.log(`cuantia (p): ${p_real}  \n`)
        
        //area de acero
        let As = (p_real* (Ancho_paso*1000) * (d_efectiva*1000)).toFixed(1)
        console.log(`area de acero (As): ${As}  mm^2 \n`)
        
        console.log('ES CRITERIO DEL DISEÑADOR SI USA EL AREA RECOMENDADA POR EL PROGRAMA \n')
        //Definir Area de varilla para el refuerzo principal longitudinal        
        
        let av_tomada = 0
        let varillaNo3 = 71
        let varillaNo4 = 129
        let varillaNo5 = 199
        let varillaNo6 = 284
        let varillaNo7 = 387
        
        if (Math.ceil(As) > 192 && Math.ceil(As) < 426){
            av_tomada = varillaNo3
        }
    
        if (Math.ceil(As) > 426 && Math.ceil(As) < 774){
            av_tomada = varillaNo4
        }
        
        if (Math.ceil(As) > 774 && Math.ceil(As) < 1194){
            av_tomada = varillaNo5
        }
        
        if (Math.ceil(As) > 774 && Math.ceil(As) < 1704){
            av_tomada = varillaNo6
        }
        
        if (Math.ceil(As) > 1704 && Math.ceil(As) < 2322){
            av_tomada = varillaNo5
        } 
        console.log(`Area de varilla tomada: ${av_tomada} mm^2 \n`)

        //Refuerzo principal longuitudinal
        let R_prin = (As/av_tomada).toFixed()
        console.log(`Refuerzo principal: ${R_prin} unidades`)
        //CANTIDAD DE VARRILLAS CON UNA SEPARACION (S)
        console.log('CANTIDAD DE VARRILLAS CON UNA SEPARACION (S) \n')
        let C_varillas = Math.round((R_prin))
        console.log(`cantidad de varillas: ${C_varillas} unidades`)

        //SEPERACION
        let separacion = (Ancho_paso/C_varillas).toFixed(2)
        console.log(`SEPARACIÓN : ${separacion} metros \n`)

        //Definir Area de varilla para el refuerzo momento negativo
        console.log('DEFINIENDO AREA DE VARILLAS A TRABAJAR \n')

        let av_tomada2 = 0
        
        if (Math.round(As) > 192 && Math.round(As) < 426 ){
            av_tomada2 = varillaNo3
        }

        if (Math.round(As) > 426 && Math.round(As) < 774){
            av_tomada2 = varillaNo4
        }

        if (Math.round(As) > 774 && Math.round(As) < 1194){
            av_tomada2 = varillaNo5
        }

        if (Math.round(As) > 774 && Math.round(As) < 1704){
            av_tomada2 = varillaNo6
        }

        if (Math.round(As) > 1704 && Math.round(As) < 2322){
            av_tomada2 = varillaNo5
        }

        console.log(`Area de varilla tomada: ${av_tomada2} mm^2`)

        //Refuerzo principal longuitudinal
        let R_negativo = ((As/2)/av_tomada2).toFixed(1)
        console.log(`Refuerzo negativo : ${R_negativo} unidades`)
        //CANTIDAD DE VARRILLAS CON UNA SEPARACION (S)
        console.log('CANTIDAD DE VARRILLAS CON UNA SEPARACION (S) \n')
        let C_varillas2 = Math.ceil((R_negativo))
        console.log(`cantidad de varillas: ${C_varillas2} unidades`)
        
        //SEPERACION
        let separacion2 = (Ancho_paso/C_varillas2).toFixed(2)
        console.log(`SEPARACIÓN : ${separacion2} metros \n`)
        
        let pt=0
        //Refuerzo por contracción
        if (fy <= 420){
            pt = 0.0018
        }
        else{
            pt = 0.0020
        }
        
        let av_tomada3 = 0
        let Av_contraccion = (pt * (Ancho_paso*1000) * (d_efectiva*1000))
        console.log(`Refuerzo por contracción : ${Av_contraccion} mm^2 \n`)

        if (Math.ceil(Av_contraccion) > 100 && Math.ceil(Av_contraccion) < 426){
            av_tomada3 = varillaNo3
        }
    
        if (Math.ceil(Av_contraccion) > 426 && Math.ceil(Av_contraccion) < 774){
            av_tomada3 = varillaNo4
        }
        
        if (Math.ceil(Av_contraccion) > 774 && Math.ceil(Av_contraccion) < 1194){
            av_tomada3 = varillaNo5
        }
        
        if (Math.ceil(Av_contraccion) > 774 && Math.ceil(Av_contraccion) < 1704){
            av_tomada3 = varillaNo6
        }
        
        if (Math.ceil(Av_contraccion) > 1704 && Math.ceil(Av_contraccion) < 2322){
            av_tomada3 = varillaNo5
        }

        console.log(`Area de varilla tomada: ${av_tomada3} mm^2 \n`)

        //Refuerzo por contracción
        let R_contracción = (Av_contraccion/av_tomada3)
        console.log(`Refuerzo por contracción : ${R_contracción} unidad`)
        //CANTIDAD DE VARRILLAS 
        console.log('CANTIDAD DE VARRILLAS \n')
        let C_varillas3 = Math.ceil(R_contracción)
        console.log(`cantidad de varillas: ${C_varillas3} unidades \n`)
        

        setReporte({
            Luz_libre,
            espesor,
            s_fuerza,
            Re_b,
            Re_a,
            Vx,
            M_max,
            d_efectiva,
            p_real,
            As,
            av_tomada,
            R_prin,
            C_varillas,
            separacion,
            av_tomada2,
            R_negativo,
            C_varillas2,
            separacion2,
            Av_contraccion,
            av_tomada3,
            R_negativo,
            R_contracción,
            C_varillas3
        })

        setCargando(true)

       
    }


    const vigasSchema = Yup.object().shape({
        Luz_losa: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        Luz_esca: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fy : Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fc: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        carga_CT1 : Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        carga_CT2 : Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        Ancho_paso: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        recubrimiento: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
    })


    //Validando el formulario
    return (
        <Layout
            page='Escaleras'
        >
            <div >
                <h2
                    className=' text-center text-gray-900 text-4xl font-bold mt-3 font-mono'
                    >LEA BIEN ANTES DE USAR EL PROGRAMA 
                </h2>
                <p className=" text-center font-mono font-bold text-gray-900 text-lg">
                    ESTE PROGRAMA TRABAJA PARA CARGAS DISTRIBUIDA
                </p>

                <Formik
                    initialValues={{
                        Luz_losa: 0,
                        Luz_esca: 0,
                        fy: 0,
                        fc:0,
                        carga_CT1: 0,
                        carga_CT2: 0,
                        Ancho_paso: 0,
                        recubrimiento: 0
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
                                    <label htmlFor='Luz_losa' 
                                        className=' block font-mono text-gray-900'
                                    >Luz del descanso (m): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='Luz_losa'
                                        name='Luz_losa'
                                    />
                                    {errors.Luz_losa && touched.Luz_losa ? (
                                        <Error>
                                            {errors.Luz_losa}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='Luz_esca' 
                                        className=' block font-mono text-gray-900'
                                    >Luz del tramo inclinado (m): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='Luz_esca'
                                        name='Luz_esca'
                                    />
                                    {errors.Luz_esca && touched.Luz_esca ? (
                                        <Error>
                                            {errors.Luz_esca}
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
                                    <label htmlFor='carga_CT1'
                                        className=' block font-mono text-gray-900'
                                    >Carga distribuida 1 (kN/m^2):</label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='carga_CT1'
                                        name='carga_CT1'
                                    />
                                    {errors.carga_CT1 && touched.carga_CT1 ? (
                                        <Error>
                                            {errors.carga_CT1}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='carga_CT2'
                                        className=' block font-mono text-gray-900'
                                    >Carga distribuida 2 (kN/m^2): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='carga_CT2'
                                        name='carga_CT2'
                                    />
                                    {errors.carga_CT2 && touched.carga_CT2 ? (
                                        <Error>
                                            {errors.carga_CT2}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='Ancho_paso'
                                        className=' block font-mono text-gray-900'
                                    >Escriba el ancho de los pasos (m) </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='Ancho_paso'
                                        name='Ancho_paso'
                                    />
                                    {errors.Ancho_paso && touched.Ancho_paso ? (
                                        <Error>
                                            {errors.Ancho_paso}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='recubrimiento'
                                        className=' block font-mono text-gray-900'
                                    >Recubrimiento (mm): </label>
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
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">luz libre: <span className=' text-red-700 font-normal'>{reporte.Luz_libre} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">espesor : <span className=' text-red-700 font-normal'>{reporte.espesor} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">sumatoria de fuerza y : <span className=' text-red-700 font-normal'>{reporte.s_fuerza} Kn</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">REACCIÓN EN (B) : <span className=' text-red-700 font-normal'>{reporte.Re_b} Kn</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">REACCIÓN EN (A) : <span className=' text-red-700 font-normal'>{reporte.Re_a} Kn </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">CORTANTE EN (X) : <span className=' text-red-700 font-normal'>{reporte.Vx} Metros </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Momento Maximo : <span className=' text-red-700 font-normal'>{reporte.M_max} Kn*m </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">distancia efectiva (d): <span className=' text-red-700 font-normal'>{reporte.d_efectiva} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">cuantia (p): <span className=' text-red-700 font-normal'>{reporte.p_real}</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">area de acero (As): <span className=' text-red-700 font-normal'>{reporte.As}  mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">ES CRITERIO DEL DISEÑADOR SI USA EL AREA RECOMENDADA POR EL PROGRAMA </p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de varilla tomada: <span className=' text-red-700 font-normal'>{reporte.av_tomada} mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Refuerzo principal: <span className=' text-red-700 font-normal'>{reporte.R_prin} unidades</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">CANTIDAD DE VARRILLAS CON UNA SEPARACION (S) PARA EL REFUERZO PRINCIPAL </p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">cantidad de varillas para refuerzo principal: <span className=' text-red-700 font-normal'>{reporte.C_varillas} unidades</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">SEPARACIÓN : <span className=' text-red-700 font-normal'>{reporte.separacion} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de varilla tomada: <span className=' text-red-700 font-normal'>{reporte.av_tomada2} mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Refuerzo negativo : <span className=' text-red-700 font-normal'>{reporte.R_negativo} unidades</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">CANTIDAD DE VARRILLAS CON UNA SEPARACION (S) PARA EL REFUERZO NEGATIVO</p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">cantidad de varillas para refuerzo negativo: <span className=' text-red-700 font-normal'>{reporte.C_varillas2} unidades</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">SEPARACIÓN : <span className=' text-red-700 font-normal'>{reporte.separacion2} metros</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Refuerzo por contracción: <span className=' text-red-700 font-normal'>{reporte.Av_contraccion} mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Area de varilla tomada: <span className=' text-red-700 font-normal'>{reporte.av_tomada3} mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Cantidad de varillas: <span className=' text-red-700 font-normal'>{reporte.C_varillas3} unidades</span></p>

                        

                        
                    </div>
                )}    
            </div>
        </Layout>
    )
}

export default Escaleras
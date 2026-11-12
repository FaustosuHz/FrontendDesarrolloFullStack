import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const Grafica = ({ etiquetas, datos, nombreGrafica, nombreDatos }) => {

    const options = {
        responsive: true,
        aspectRatio: 1.3,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `${nombreGrafica ? nombreGrafica : "Grafica"}`,
                color: '#1d3557',
                font: { family: 'Montserrat', size: 17, weight: '600' },
                padding: { bottom: 16 },
            },
        },
        scales: {
            x: {
                ticks: { color: '#5f6b82', font: { family: 'Montserrat', size: 13 } },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#5f6b82', precision: 0, font: { family: 'Montserrat', size: 13 } },
                grid: { color: '#e3e7ef' },
            },
        },
    };

    const data = {
        labels: etiquetas,
        datasets: [
            {
                label: `${nombreDatos ? nombreDatos : "Datos"}`,
                data: datos,
                backgroundColor: '#2f5d8f',
                borderRadius: 8,
                maxBarThickness: 64,
            }
        ],
    };

    return <Bar options={options} data={data} />;
}

export default Grafica

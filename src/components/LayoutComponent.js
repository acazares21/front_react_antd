import { div } from 'antd'
import React from 'react'
import { Outlet, Link } from 'react-router-dom';

//Componente para el layout del breadcrumb
export const LayoutComponent = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/proyectos">Proyectos</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
    
  )
}

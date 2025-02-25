
export const authorization = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Acceso denegado: no tienes permiso' });
      }
      next();
    };
  };
  
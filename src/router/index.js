import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '@/views/HomeView.vue'
import NotFound404 from '@/views/NotFound404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/propiedades/:id',
      name: 'propiedad',
      component: () => import('@/views/PropiedadView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: { name: 'admin-propiedades' },
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'propiedades',
          name: 'admin-propiedades',
          component: () => import('@/views/admin/AdminView.vue')
        },
        {
          path: 'nueva',
          name: 'nueva-propiedad',
          component: () => import('@/views/admin/NuevPropiedadView.vue')
        },
        {
          path: 'editar/:id',
          name: 'editar-propiedad',
          component: () => import('@/views/admin/EditarPropiedadView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      sensitive: true,
      name: 'not-found',
      component: NotFound404
    }
  ],
  strict: true
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((url) => url.meta.requiresAuth)

  if (requiresAuth) {
    try {
      await authenticateUser()
      next()
    } catch (error) {
      console.log(error)
      next({ name: 'login' })
    }
  } else {
    console.log(to.name)
    if (to.name === 'login') {
      try {
        await authenticateUser()
        next({ name: 'admin-propiedades' })
      } catch (error) {
        next()
      }
    } else {
      next()
    }
  }
})

const authenticateUser = () => {
  const auth = useFirebaseAuth()
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

export default router

export const PAGES_MENU = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'ion-android-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Users',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          {
            path: 'allUsers',
            data: {
              menu: {
                title: 'All',
                url: 'allUsers'
              }
            }
          }
          // {
          //   path: 'singleUser',
          //   data: {
          //     menu: {
          //       title: 'Single',
          //       url: '/singleUser'
          //     }
          //   }
          // }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Newsletter',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: 'newsletterSearch',
            data: {
              menu: {
                title: 'Search',
                url: 'newsletterSearch'
              }
            }
          }
          // {
          //   path: 'newsletterCreate',
          //   data: {
          //     menu: {
          //       title: 'Create',
          //       url: '/newsletterCreate'
          //     }
          //   }
          // }
        ]
      },
      // {
      //   path: '',
      //   data: {
      //     menu: {
      //       title: 'Pages',
      //       icon: 'ion-document',
      //       selected: false,
      //       expanded: false,
      //       order: 650,
      //     }
      //   },
      //   children: [
      //     {
      //       path: '',
      //       data: {
      //         menu: {
      //           title: 'Login',
      //           url: '/login'
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: '',
      //   data: {
      //     menu: {
      //       title: 'Menu Level 1',
      //       icon: 'ion-ios-more',
      //       selected: false,
      //       expanded: false,
      //       order: 700,
      //     }
      //   },
      //   children: [
      //     {
      //       path: '',
      //       data: {
      //         menu: {
      //           title: 'Menu Level 1.1',
      //           url: '#'
      //         }
      //       }
      //     },
      //     {
      //       path: '',
      //       data: {
      //         menu: {
      //           title: 'Menu Level 1.2',
      //           url: '#'
      //         }
      //       },
      //       children: [
      //         {
      //           path: '',
      //           data: {
      //             menu: {
      //               title: 'Menu Level 1.2.1',
      //               url: '#'
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: '',
        data: {
          menu: {
            title: 'Github',
            url: 'http://github.com/ks89',
            icon: 'ion-android-exit',
            order: 800,
            target: '_blank'
          }
        }
      }
    ]
  }
];

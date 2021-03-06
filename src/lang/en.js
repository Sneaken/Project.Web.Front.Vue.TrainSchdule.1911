var dict = {
  default: {
    language: {
      en: 'English',
      ch: '中文'
    },
    system: {
      title: 'system',
      clipboard: {
        success: 'copy success',
        fail: 'copy fail'
      }
    },
    app: {
      title: 'application',
      log: {
        title: 'log'
      },
      phyGrade: {
        title: 'physical grade',
        rules: {
          title: 'rule config',
          about: {
            title: 'about'
          },
          subject: {
            title: 'subject'
          },
          standard: {
            title: 'standard'
          }
        },
        detail: {
          title: 'grade card'
        },
        list: {
          title: 'grade list'
        },
        statistics: {
          title: 'company statistics'
        }
      },
      file: {
        title: 'file'
      },
      dwz: {
        title: 'shortUrl'
      },
      manager: {
        title: 'manager'
      },
      iframepage: {
        title: 'page'
      },
      memberRate: {
        title: 'rate',
        summary: {
          title: 'rate summary'
        }
      }
    },
    utils: {
      title: 'tool',
      qrCode: {
        title: 'qrCode',
        Create: {
          title: 'generate'
        },
        Scan: {
          title: 'scan'
        }
      }
    }
  },
  form: {
    company: {
      title: 'company',
      auditBy: 'approve company',
      createBy: 'from company',
      involved: 'involved company'
    },
    user: {
      title: 'user',
      auditBy: 'approve by',
      createBy: 'create by',
      from: 'from'
    },
    grade: {
      phy: {
        standard: {
          title: 'standard'
        },
        subject: {
          title: 'subject'
        },
        about: {
          title: 'about'
        }
      }
    },
    date: {
      title: 'date'
    }
  },
  application: {
    title: 'vacation manage',
    new: 'wanna a vacation',
    audit: 'audit sb/s vacation',
    detail: 'detail of apply',
    my: 'mine vacation',
    setting: {
      title: 'setting options',
      application: {
        title: 'vacation apply',
        auditStream: 'audit stream',
        exportXls: 'export Excel model'
      },
      users: {
        title: 'manage users',
        social: 'social',
        company: 'company'
      },
      updateRecord: 'release record'
    }
  },
  navbar: {
    dashboard: 'statistics',
    logOut: 'logout',
    profile: 'profile',
    welcome: 'homepage'
  },
  register: {
    title: 'register',
    new: 'register',
    checkemail: 'confirm email',
    audit: 'audit account'
  },
  login: {
    title: 'login',
    defaultTitle: 'login',
    username: 'username',
    password: 'password'
  },
  profiles: {
    activity: '@',
    timeline: 'timeline',
    account: 'mine'
  },
  comments: {
    title: 'message',
    notice: {
      title: 'notice'
    },
    bbs: {
      title: 'bbs'
    }
  },
  settings: {
    title: 'setting options',
    fixedHeader: 'fixed header',
    tagsView: 'tagsView',
    theme: 'theme',
    refresh: 'refresh',
    close: 'close',
    closeAll: 'close all',
    closeOthers: 'close others',
    sidebarLogo: 'sidebar logo'
  },
  errorLog: {
    title: 'error log'
  },
  about: {
    version: {
      title: 'releases'
    }
  }
}
dict.tagsView = dict.settings
dict.route = dict
Object.keys(dict.navbar).forEach((k) => {
  dict.route[k] = dict.navbar[k]
})
export default dict

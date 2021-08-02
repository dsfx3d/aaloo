# aaloo

One aaloo to rule them all. A multi purpose utility class.

```typescript
class PaginationMixin extends ServiceMixin {
  page = 1;
  limit = 20;

  withPagination(page, limit) {
    this.page = page;
    this.limit = limit;
  }

  AalooConfig() {
    return {
      page: this.page,
      limit: this.limit,
    };
  }
}

class ApiHeadersMixin extends ServiceMixin {
  withApiToken(token) {
    this.token = token;
  }

  AalooConfig() {
    return {
      headers: {
        'x-api-token': this.token,
      },
    };
  }
}

@Service.config({
  client: axios,
  baseUrl: 'https://api/api/v1/',
})
class OrgService extends Service {
  protected static get mixins() {
    return [...super.mixins, PaginationMixin, ApiHeadersMixin];
  }
}

@Service.config({
  endpoint: 'notifications',
})
class NotificationsService extends OrgService {
  private user!: User;

  get userId() {
    return user!.id;
  }

  @Service.post(':userId/notif')
  createNotification({ userId, data }) {
    return this.withArgs({ userId }).withData(data);
  }

  @Service.patch('notif/:notifId')
  markAsRead({ notifId }) {
    return this.withArgs({ notifId });
  }

  @Service.resolved({ resolution: 'payload.user' })
  @Service.patch('notif/user/:id')
  async registerUser(id) {
    this.withArgs({ id }).onResolve((user) => {
      this.user = user;
    });
  }

  @Service.resolved({ fallback: [] })
  @Service.get('user/:id/notif')
  getMyNotifications() {
    return this.withArgs({ id: this.user.id });
  }
}
```

```javascript
await NotificationsService.getService().registerUser(1);

NotificationsService.getService().userId === 1; // ?= true

await NotificationsService.getService()
  .withQuery('read', false)
  .withQuery({ startDate: '2021-01-01', endDate: '2021-01-02' });
  .withPagination(1, 20) // from pagination mixin
  .withApiToken(process.env.API_TOKEN) // from ApiHeaders mixin
  .withOrder('-createdAt')
  .getMyNotifications();
// GET https://api/api/v1/notifications/user/1/notif?read=false&startDate=2021-01-01&endDate=2021-01-02&page=1&limit=20&sort_by=-createdAt
```

from sqlalchemy import Identity, Integer, TIMESTAMP, create_engine
from sqlalchemy import desc, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, Session, mapped_column, sessionmaker


class TableBase(MappedAsDataclass, DeclarativeBase):
    pass


class Timers(TableBase):
    __tablename__ = 'timers'

    id: Mapped[int] = mapped_column(Integer, Identity(start=1), primary_key=True, init=False)
    page: Mapped[str]
    elapsed_time: Mapped[int]
    created_at: Mapped[int] = mapped_column(TIMESTAMP, nullable=False, server_default=func.CURRENT_TIMESTAMP(), init=False)


class FeatureUsage(TableBase):
    __tablename__ = 'feature_usage'
    id: Mapped[int] = mapped_column(Integer, Identity(start=1), primary_key=True, init=False)
    feature: Mapped[str]
    instance: Mapped[str]
    used: Mapped[bool]
    created_at: Mapped[int] = mapped_column(TIMESTAMP, nullable=False, server_default=func.CURRENT_TIMESTAMP(), init=False)


class Metrics:

    @staticmethod
    def db_connect(readonly: bool = False) -> Session:
        try:
            with open("./config.txt", 'r') as config_file:
                password = config_file.read()
        except FileNotFoundError:
            raise Exception("failed to load config file")
        host = "atbet-database.cluster-ro-cseus70tokua.us-east-2.rds.amazonaws.com" if readonly \
               else "atbet-database.cluster-cseus70tokua.us-east-2.rds.amazonaws.com"
        connect_string = f"mysql+pymysql://admin:{password.strip()}@{host}:3306/atbet_metrics"
        return sessionmaker(bind=create_engine(connect_string).connect())()

    @staticmethod
    def report_timer_metric(page: str, elapsed_time: int) -> None:
        db = Metrics.db_connect()
        db.add(Timers(page=page, elapsed_time=elapsed_time))
        db.commit()
        db.close()

    @staticmethod
    def report_feature_metric(feature: str, instance: str, used: bool) -> None:
        db = Metrics.db_connect()
        db.add(FeatureUsage(feature=feature, instance=instance, used=used))
        db.commit()
        db.close()

    @staticmethod
    def get_timer_metrics() -> dict:
        db = Metrics.db_connect(True)
        response_data = {}

        for page in ['opening', 'stats']:
            response_data[page] = [row.elapsed_time for row in db.query(Timers).filter_by(page=page)]

        return response_data

    @staticmethod
    def get_feature_metrics() -> dict:
        db = Metrics.db_connect(True)
        response_data = {'tooltip': []}

        for row in (db.query(FeatureUsage.feature, FeatureUsage.instance,
                             FeatureUsage.used, func.count(FeatureUsage.id).label('uses'))
                   .where(text("feature='tooltip'"), text("used=true"))
                   .group_by(FeatureUsage.feature, FeatureUsage.instance, FeatureUsage.used)
                   .order_by(desc('uses'))):
            if row.instance not in response_data['tooltip']:
                response_data['tooltip'].append((row.instance, row.uses))

        return response_data
